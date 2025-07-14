import { useEffect, useState, useMemo } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { useQuery, useQueryClient } from '@tanstack/react-query';

interface UserProfile {
    id: string;
    full_name: string | null;
    username: string | null;
    avatar_url: string | null;
    role: 'customer' | null;
    email: string;
}

interface UserRoleState {
    session: Session | null;
    user: User | null;
    profile: UserProfile | null;
    loading: boolean;
    error: Error | null;
}

const userProfileQueryKey = (userId: string) => ['userProfile', userId];

const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('id, full_name, username, avatar_url, role, email')
                    .eq('id', userId)
                    .single();

                if (error) {
                    console.error('Error fetching profile:', error);
                    throw error;
                }
                if (!data) {
                    throw new Error('No profile data found');
                }

    return data as UserProfile;
};

export const useUserRole = (): UserRoleState => {
    const [session, setSession] = useState<Session | null>(null);
    const [loadingInitial, setLoadingInitial] = useState(true);
    const [error, setError] = useState<Error | null>(null);
    const queryClient = useQueryClient();
    const user = session?.user;

    useEffect(() => {
        let mounted = true;

        const getInitialSession = async () => {
            try {
                const { data: { session: initialSession } } = await supabase.auth.getSession();
                if (mounted) {
                    setSession(initialSession);
                    setLoadingInitial(false);
                }
            } catch (err) {
                if (mounted) {
                    console.error("Error getting initial session:", err);
                    setError(err instanceof Error ? err : new Error("An unknown error occurred"));
                    setLoadingInitial(false);
                }
            }
        };

        getInitialSession();

        const { data: authListener } = supabase.auth.onAuthStateChange((event, newSession) => {
            if (mounted) {
                if (event === 'SIGNED_OUT') {
                    queryClient.invalidateQueries({ queryKey: ['userProfile'] });
                }
                setSession(newSession);
                    }
        });

        return () => {
            mounted = false;
            authListener.subscription.unsubscribe();
        };
    }, [queryClient]);

    const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery<UserProfile, Error>({
        queryKey: userProfileQueryKey(user?.id ?? ''),
        queryFn: () => fetchUserProfile(user!.id),
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 1,
    });
    
    const combinedError = useMemo(() => error || profileError, [error, profileError]);

    return {
        session,
        user: user || null,
        profile: profile || null,
        loading: loadingInitial || (!!user && isLoadingProfile),
        error: combinedError
    };
};