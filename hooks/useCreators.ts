import { useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchCreators, fetchCreatorById, fetchIndustries, CreatorFilters } from '@/lib/creator-utils';

// Query keys for consistent cache management
export const creatorKeys = {
  all: ['creators'] as const,
  lists: () => [...creatorKeys.all, 'list'] as const,
  list: (filters: CreatorFilters) => [...creatorKeys.lists(), filters] as const,
  details: () => [...creatorKeys.all, 'detail'] as const,
  detail: (id: string) => [...creatorKeys.details(), id] as const,
  industries: () => [...creatorKeys.all, 'industries'] as const,
};

// Hook for fetching creators with filters and caching
export function useCreators(filters: CreatorFilters = {}) {
  return useQuery({
    queryKey: creatorKeys.list(filters),
    queryFn: () => fetchCreators(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for fetching individual creator by ID with caching
export function useCreator(id: string) {
  return useQuery({
    queryKey: creatorKeys.detail(id),
    queryFn: () => fetchCreatorById(id),
    enabled: !!id, // Only run query when id is available
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook for fetching industries with caching
export function useIndustries() {
  return useQuery({
    queryKey: creatorKeys.industries(),
    queryFn: fetchIndustries,
    staleTime: 10 * 60 * 1000, // 10 minutes (industries change rarely)
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

// Hook to invalidate creators cache
export function useCreatorMutations() {
  const queryClient = useQueryClient();

  const invalidateCreators = () => {
    queryClient.invalidateQueries({
      queryKey: creatorKeys.all,
    });
  };

  const invalidateCreatorsList = () => {
    queryClient.invalidateQueries({
      queryKey: creatorKeys.lists(),
    });
  };

  const invalidateCreator = (id: string) => {
    queryClient.invalidateQueries({
      queryKey: creatorKeys.detail(id),
    });
  };

  return {
    invalidateCreators,
    invalidateCreatorsList,
    invalidateCreator,
  };
} 