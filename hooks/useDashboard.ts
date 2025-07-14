import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getDashboardStats, getBriefHistory, DashboardStats, BriefHistoryItem } from '@/lib/dashboard-data';
import { useUserRole } from './useUserRole';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';
import { useEffect } from 'react';

// Query keys for consistent cache management
export const dashboardKeys = {
  stats: (userId?: string) => ['dashboard', 'stats', userId] as const,
  briefHistory: (userId?: string) => ['dashboard', 'briefHistory', userId] as const,
  userProfile: (userId?: string) => ['dashboard', 'userProfile', userId] as const,
};

// Hook for dashboard statistics with caching
export function useDashboardStats() {
  const { session } = useUserRole();
  const user = session?.user;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase.channel(`dashboard-stats-${user.id}`);

    const subscription = channel
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'briefs', 
        filter: `user_id=eq.${user.id}` 
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: dashboardKeys.stats(user.id) });
      })
      .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'profiles', 
        filter: `id=eq.${user.id}` 
      }, (payload) => {
        queryClient.invalidateQueries({ queryKey: dashboardKeys.stats(user.id) });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: dashboardKeys.stats(user?.id),
    queryFn: () => getDashboardStats(user),
    enabled: !!user, // Only run query when user is available
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for brief history with caching
export function useBriefHistory() {
  const { session } = useUserRole();
  const user = session?.user;
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!user) return;

    const channel = supabase
      .channel(`public:briefs:user-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'briefs', filter: `user_id=eq.${user.id}` },
        (payload) => {
          queryClient.invalidateQueries({ queryKey: dashboardKeys.briefHistory(user.id) });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, queryClient]);

  return useQuery({
    queryKey: dashboardKeys.briefHistory(user?.id),
    queryFn: () => getBriefHistory(user),
    enabled: !!user, // Only run query when user is available
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for user profile with caching
export function useUserProfile() {
  const { session } = useUserRole();
  const user = session?.user;

  return useQuery({
    queryKey: dashboardKeys.userProfile(user?.id),
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) {
        console.error('Error fetching profile:', error);
        throw error;
      }
      
      return data;
    },
    enabled: !!user?.id, // Only run query when user is available
    staleTime: 10 * 60 * 1000, // 10 minutes (profile changes rarely)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to invalidate dashboard cache
export function useDashboardMutations() {
  const queryClient = useQueryClient();
  const { session } = useUserRole();
  const user = session?.user;

  const invalidateStats = () => {
    queryClient.invalidateQueries({
      queryKey: dashboardKeys.stats(user?.id),
    });
  };

  const invalidateBriefHistory = () => {
    queryClient.invalidateQueries({
      queryKey: dashboardKeys.briefHistory(user?.id),
    });
  };

  const invalidateUserProfile = () => {
    queryClient.invalidateQueries({
      queryKey: dashboardKeys.userProfile(user?.id),
    });
  };

  const invalidateAll = () => {
    queryClient.invalidateQueries({
      queryKey: ['dashboard'],
    });
  };

  return {
    invalidateStats,
    invalidateBriefHistory,
    invalidateUserProfile,
    invalidateAll,
  };
} 