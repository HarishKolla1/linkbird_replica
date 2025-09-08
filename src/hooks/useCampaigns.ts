import { useInfiniteQuery } from '@tanstack/react-query';
import { useCampaignFilterStore, CampaignStatus } from '@/store/campaignDashboardFilters';

export interface Campaign {
  name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
}

interface CampaignApiResponse {
  name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
  [key: string]: any; // other fields we ignore
}

export const useCampaignsInfinite = () => {
  const status = useCampaignFilterStore((state) => state.status);

  return useInfiniteQuery<Campaign[], Error>({
    queryKey: ['campaigns', status],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/dashboard/campaigns?page=${pageParam}&status=${status}`);
      if (!res.ok) throw new Error('Failed to fetch campaigns');

      const data: CampaignApiResponse[] = await res.json();
        console.log('[Campaigns Hook] Page:', pageParam, 'Status:', status, 'Data:', data);
      return data.map(c => ({ name: c.name, status: c.status }));
    },
    getNextPageParam: (lastPage, allPages) => lastPage.length === 20 ? allPages.length : undefined,
  });
};
