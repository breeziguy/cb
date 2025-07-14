import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useUserRole } from './useUserRole';
import { useNotifications } from '@/contexts/NotificationContext';
import { notificationHelpers } from '@/utils/notifications';

interface FavoriteCreator {
  id: string;
  creator_id: string;
  user_id: string;
  created_at: string;
  notes?: string;
  tags?: string[];
  creator?: {
    id: string;
    name: string;
    username: string;
    industry: string;
    category: string;
    avatar_url?: string;
    instagram_profile?: string;
    tiktok_profile?: string;
  };
}

// Query keys for consistent cache management
export const favoritesKeys = {
  all: ['favorites'] as const,
  lists: () => [...favoritesKeys.all, 'list'] as const,
  list: (userId?: string) => [...favoritesKeys.lists(), userId] as const,
};

// Fetch user's favorites
const fetchFavorites = async (userId: string): Promise<FavoriteCreator[]> => {
  const { data, error } = await supabase
    .from('saved_creators')
    .select(`
      *,
      creator:creators(
        id,
        name,
        username,
        industry,
        category,
        avatar_url,
        instagram_profile,
        tiktok_profile
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching favorites:', error);
    throw error;
  }

  return data || [];
};

export function useFavorites() {
  const { session } = useUserRole();
  const user = session?.user;
  const queryClient = useQueryClient();
  const { addNotification } = useNotifications();

  // Fetch favorites with caching
  const { data: favorites = [], isLoading: loading, refetch } = useQuery({
    queryKey: favoritesKeys.list(user?.id),
    queryFn: () => fetchFavorites(user!.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create favoriteIds set from favorites data
  const favoriteIds = new Set(favorites.map(fav => fav.creator_id));

  // Add to favorites mutation
  const addToFavoritesMutation = useMutation({
    mutationFn: async ({ creatorId, notes, tags }: { creatorId: string; notes?: string; tags?: string[] }) => {
      if (!user?.id) {
        throw new Error('User must be logged in to add favorites');
      }

      const { data, error } = await supabase
        .from('saved_creators')
        .insert({
          user_id: user.id,
          creator_id: creatorId,
          notes: notes || null,
          tags: tags || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error adding to favorites:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user?.id) });
    },
  });

  // Remove from favorites mutation
  const removeFromFavoritesMutation = useMutation({
    mutationFn: async (creatorId: string) => {
      if (!user?.id) {
        throw new Error('User must be logged in to remove favorites');
      }

      const { error } = await supabase
        .from('saved_creators')
        .delete()
        .eq('user_id', user.id)
        .eq('creator_id', creatorId);

      if (error) {
        console.error('Error removing from favorites:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user?.id) });
    },
  });

  // Update favorite mutation
  const updateFavoriteMutation = useMutation({
    mutationFn: async ({ creatorId, updates }: { creatorId: string; updates: { notes?: string; tags?: string[] } }) => {
      if (!user?.id) {
        throw new Error('User must be logged in to update favorites');
      }

      const { error } = await supabase
        .from('saved_creators')
        .update(updates)
        .eq('user_id', user.id)
        .eq('creator_id', creatorId);

      if (error) {
        console.error('Error updating favorite:', error);
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch favorites
      queryClient.invalidateQueries({ queryKey: favoritesKeys.list(user?.id) });
    },
  });

      // Helper functions that maintain the same interface
    const addToFavorites = async (creatorId: string, notes?: string, tags?: string[]) => {
        // Get creator data first for notification
        const { data: creator } = await supabase
            .from('creators')
            .select('name, avatar_url')
            .eq('id', creatorId)
            .single();
            
        const result = await addToFavoritesMutation.mutateAsync({ creatorId, notes, tags });
        
        // Add notification after successful favorite
        if (creator) {
            addNotification(notificationHelpers.favoriteCreator(creator.name, creator.avatar_url, creatorId));
        }
        
        return result;
    };

    const removeFromFavorites = async (creatorId: string) => {
        return removeFromFavoritesMutation.mutateAsync(creatorId);
    };

  const toggleFavorite = async (creatorId: string, notes?: string, tags?: string[]) => {
    const isFavorited = favoriteIds.has(creatorId);
    
    if (isFavorited) {
      await removeFromFavorites(creatorId);
    } else {
      await addToFavorites(creatorId, notes, tags);
    }
  };

      const updateFavorite = async (creatorId: string, updates: { notes?: string; tags?: string[] }) => {
        return updateFavoriteMutation.mutateAsync({ creatorId, updates });
    };

  const isFavorited = (creatorId: string) => {
    return favoriteIds.has(creatorId);
  };

  return {
    favorites,
    loading,
    favoriteIds,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    updateFavorite,
    isFavorited,
    refetch
  };
} 