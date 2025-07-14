import { useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUserRole } from './useUserRole';
import { useEffect } from 'react';

export type BriefType = {
    id: string;
    title: string;
    description: string;
    status: string;
    budget: number;
    created_at: string;
    user_id: string;
    creator_id?: string;
    creator?: {
        name: string;
        username: string;
        avatar_url: string | null;
    };
    user?: {
        name: string;
        avatar_url: string | null;
    };
};

const briefKeys = {
    all: (userId?: string) => ['briefs', userId] as const,
};

async function fetchBriefs(userId: string): Promise<BriefType[]> {
    const { data: briefsData, error: briefsError } = await supabase
        .from('briefs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

    if (briefsError) {
        console.error('Error fetching briefs:', briefsError);
        throw briefsError;
    }

    if (!briefsData || briefsData.length === 0) {
        return [];
    }

    const creatorIds = briefsData
        .filter((brief: any) => brief.creator_id)
        .map((brief: any) => brief.creator_id);

    let creatorsData: any[] = [];
    if (creatorIds.length > 0) {
        const { data: fetchedCreators, error: creatorsError } = await supabase
            .from('creators')
            .select('id, name, username, avatar_url')
            .in('id', creatorIds);

        if (creatorsError) {
            console.error('Error fetching creators:', creatorsError);
        } else {
            creatorsData = fetchedCreators || [];
        }
    }
    
    const { data: userData, error: userError } = await supabase
        .from('profiles')
        .select('id, full_name, avatar_url')
        .eq('id', userId)
        .single();

    if (userError) {
        console.error('Error fetching user data:', userError);
    }

    return briefsData.map((brief: any) => ({
        ...brief,
        creator: brief.creator_id ? creatorsData.find((creator: any) => creator.id === brief.creator_id) : undefined,
        user: userData ? {
            name: userData.full_name || 'Brief Owner',
            avatar_url: userData.avatar_url
        } : undefined
    }));
}

export function useBriefs() {
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
                    queryClient.invalidateQueries({ queryKey: briefKeys.all(user.id) });
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user, queryClient]);

    return useQuery({
        queryKey: briefKeys.all(user?.id),
        queryFn: () => fetchBriefs(user!.id),
        enabled: !!user,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
} 