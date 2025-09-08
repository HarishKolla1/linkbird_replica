import { useInfiniteQuery } from '@tanstack/react-query';
import { useLeadsFilterStore } from '@/store/dashboardLeadsFilters';

export type Lead = {
  id: number;
  name: string;
  company: string;
  campaign: { name: string };
  status: string;
};

export const useLeadsInfinite = () => {
  const { timeFilter } = useLeadsFilterStore();

  return useInfiniteQuery({
    queryKey: ['leads', timeFilter],
    queryFn: async ({ pageParam = 0 }) => {
      console.log(`[useLeadsInfinite] Fetching leads page ${pageParam} with filter "${timeFilter}"`);
      const res = await fetch(`/api/dashboard/leads?page=${pageParam}&timeFilter=${encodeURIComponent(timeFilter)}`);
      if (!res.ok) throw new Error('Failed to fetch leads');
      const data = await res.json();
      console.log('[useLeadsInfinite] Fetched leads:', data.recentLeads);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage * 20 < lastPage.totalLeads ? currentPage : undefined;
    },
  });
};
