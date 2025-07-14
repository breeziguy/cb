"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useUserRole } from '@/hooks/useUserRole';

export interface NotificationData {
    id: string;
    type: "wallet" | "brief" | "favorite" | "brief_accept" | "brief_reject";
    login: string;
    action: string;
    product: string;
    content?: string;
    description?: string; // Meaningful description for users
    avatar: string;
    time: string;
    new: boolean;
    creator_id?: string; // Add creator_id for dynamic routing
}

interface NotificationContextType {
    notifications: NotificationData[];
    addNotification: (notification: Omit<NotificationData, 'id' | 'time' | 'new'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};

function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getRelativeTime(): string {
    return "just now";
}

function getRelativeTimeFromDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
}

// Helper functions to extract parts from stored message
function extractLoginFromMessage(message: string): string {
    const match = message.match(/^(@[^\s]+)/);
    return match ? match[1] : '@user';
}

function extractActionFromMessage(message: string): string {
    const parts = message.split(' ');
    if (parts.length > 1) {
        // Skip the login part and get the action
        return parts.slice(1).join(' ').split(' ')[0] || 'did something';
    }
    return 'did something';
}

function extractProductFromMessage(message: string): string {
    const parts = message.split(' ');
    if (parts.length > 2) {
        // Skip login and action, get the rest
        return parts.slice(2).join(' ');
    }
    return '';
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<NotificationData[]>([]);
    const { session } = useUserRole();
    const user = session?.user;

    // Fetch notifications from Supabase on load and set up realtime subscription
    useEffect(() => {
        if (user?.id) {
            fetchNotifications();
            
            // Set up realtime subscription
            const channel = supabase
                .channel(`notifications-${user.id}`)
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`,
                    },
                    (payload) => {
                        console.log('🔄 Realtime notification payload:', payload);

                        if (payload.eventType === 'INSERT') {
                            // Transform the new notification to our format
                            const newNotification: NotificationData = {
                                id: payload.new.id,
                                type: payload.new.type,
                                login: extractLoginFromMessage(payload.new.message),
                                action: extractActionFromMessage(payload.new.message),
                                product: extractProductFromMessage(payload.new.message),
                                content: payload.new.message,
                                description: payload.new.meta?.original?.description || payload.new.meta?.description,
                                avatar: payload.new.avatar || '/images/avatars/placeholder.png',
                                time: getRelativeTimeFromDate(payload.new.created_at),
                                new: !payload.new.read,
                                creator_id: payload.new.meta?.creator_id || null,
                            };
                            
                            // Prevent duplicates by checking if notification already exists
                            setNotifications((prev) => {
                                // Check if this notification already exists (by ID or content+type combination)
                                const existsById = prev.some(n => n.id === newNotification.id);
                                const existsByContent = prev.some(n => 
                                    n.type === newNotification.type &&
                                    n.login === newNotification.login &&
                                    n.action === newNotification.action &&
                                    n.product === newNotification.product &&
                                    Math.abs(new Date().getTime() - new Date(payload.new.created_at).getTime()) < 5000 // Within 5 seconds
                                );
                                
                                if (existsById || existsByContent) {
                                    console.log('🚫 Preventing duplicate notification:', newNotification);
                                    return prev;
                                }
                                
                                return [newNotification, ...prev];
                            });
                        } else if (payload.eventType === 'UPDATE') {
                            // Update existing notification
                            setNotifications((prev) =>
                                prev.map((n) => 
                                    n.id === payload.new.id 
                                        ? { ...n, new: !payload.new.read }
                                        : n
                                )
                            );
                        }
                    }
                )
                .subscribe();

            return () => {
                supabase.removeChannel(channel);
            };
        }
    }, [user?.id]);

    const fetchNotifications = async () => {
        if (!user?.id) return;

        try {
            const { data, error } = await supabase
                .from('notifications')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })
                .limit(50); // Limit to last 50 notifications

            if (error) {
                console.error('Error fetching notifications:', error);
                return;
            }

            // Transform Supabase data to NotificationData format
            const transformedNotifications: NotificationData[] = data.map(row => ({
                id: row.id,
                type: row.type,
                login: extractLoginFromMessage(row.message),
                action: extractActionFromMessage(row.message),
                product: extractProductFromMessage(row.message),
                content: row.message,
                description: row.meta?.original?.description || row.meta?.description,
                avatar: row.avatar || '/images/avatars/placeholder.png',
                time: getRelativeTimeFromDate(row.created_at),
                new: !row.read,
                creator_id: row.meta?.creator_id || null,
            }));

            setNotifications(transformedNotifications);
        } catch (error) {
            console.error('Error in fetchNotifications:', error);
        }
    };

    const addNotification = useCallback(async (notificationData: Omit<NotificationData, 'id' | 'time' | 'new'>) => {
        if (!user?.id) return;

        // First save to Supabase to get the real ID
        try {
            const { data, error } = await supabase
                .from('notifications')
                .insert({
                    user_id: user.id,
                    type: notificationData.type,
                    title: `${notificationData.login} ${notificationData.action}`,
                    message: `${notificationData.login} ${notificationData.action} ${notificationData.product}`,
                    avatar: notificationData.avatar,
                    read: false,
                    meta: {
                        content: notificationData.content,
                        creator_id: notificationData.creator_id,
                        original: notificationData
                    }
                })
                .select()
                .single();

            if (error) {
                console.error('Error saving notification to Supabase:', error);
                
                // Fallback: Add with generated ID if Supabase fails
                const fallbackNotification: NotificationData = {
                    ...notificationData,
                    id: generateId(),
                    time: getRelativeTime(),
                    new: true,
                };
                
                setNotifications(prev => {
                    // Check for recent duplicates before adding fallback
                    const isDuplicate = prev.some(n => 
                        n.type === fallbackNotification.type &&
                        n.login === fallbackNotification.login &&
                        n.action === fallbackNotification.action &&
                        n.product === fallbackNotification.product &&
                        n.time === "just now"
                    );
                    
                    if (isDuplicate) {
                        console.log('🚫 Preventing duplicate fallback notification');
                        return prev;
                    }
                    
                    return [fallbackNotification, ...prev];
                });
                return;
            }

            // If Supabase succeeds, the realtime subscription will handle adding it
            // No need to add to local state here as realtime will trigger
            console.log('✅ Notification saved to Supabase, realtime will add to UI');
            
        } catch (error) {
            console.error('Error in addNotification:', error);
        }
    }, [user?.id]);

    const markAsRead = useCallback(async (id: string) => {
        if (!user?.id) return;

        // Update local state immediately
        setNotifications(prev => 
            prev.map(notification => 
                notification.id === id 
                    ? { ...notification, new: false }
                    : notification
            )
        );

        // Update in Supabase
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('id', id)
                .eq('user_id', user.id);

            if (error) {
                console.error('Error marking notification as read:', error);
            }
        } catch (error) {
            console.error('Error in markAsRead:', error);
        }
    }, [user?.id]);

    const markAllAsRead = useCallback(async () => {
        if (!user?.id) return;

        // Update local state immediately
        setNotifications(prev => 
            prev.map(notification => ({ ...notification, new: false }))
        );

        // Update all unread notifications in Supabase
        try {
            const { error } = await supabase
                .from('notifications')
                .update({ read: true })
                .eq('user_id', user.id)
                .eq('read', false);

            if (error) {
                console.error('Error marking all notifications as read:', error);
            }
        } catch (error) {
            console.error('Error in markAllAsRead:', error);
        }
    }, [user?.id]);

    const unreadCount = notifications.filter(n => n.new).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            addNotification,
            markAsRead,
            markAllAsRead,
            unreadCount,
        }}>
            {children}
        </NotificationContext.Provider>
    );
}; 