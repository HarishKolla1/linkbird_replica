import { useInfiniteQuery } from '@tanstack/react-query';
import { useCampaignUIStore } from '@/store/campaignTableStore';

// Type for the API response
interface Campaign {
  id: number;
  name: string;
  status: 'Active' | 'Inactive' | 'Draft';
  totalLeads: number;
  successfulLeads: number;
  responded: number;
  responseRate: number;
  createdAt: string;
  userId: string;
}

interface CampaignsResponse {
  data: Campaign[];
  hasNextPage: boolean;
}

export const useCampaigns = () => {
  const { searchQuery, activeTab } = useCampaignUIStore();
  const pageSize = 10;

  return useInfiniteQuery<CampaignsResponse>({
    queryKey: ['campaigns', searchQuery, activeTab],
    queryFn: async ({ pageParam = 0 }) => {
      const status = activeTab === 'All Campaigns' ? '' : `&status=${activeTab}`;
      const res = await fetch(`/api/campaigns?page=${pageParam}&pageSize=${pageSize}&searchQuery=${searchQuery}${status}`);
      if (!res.ok) {
        throw new Error('Network response was not ok');
      }
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.hasNextPage) {
        return allPages.length;
      }
      return undefined;
    },
    staleTime: 5 * 60 * 1000, // Data is considered fresh for 5 minutes
  });
};
