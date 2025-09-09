import { useInfiniteQuery } from "@tanstack/react-query";
import { useLeadsTableStore } from "@/store/leadsTableStore";

export type Lead = {
  id: number;
  name: string;
  company: string;
  campaignId: number;
  status: string;
  lastContactDate: string | null;
  interactionHistory: string[];
};

export type Campaign = {
  id: number;
  name: string;
};

export type CampaignLeadItem = {
  leads: Lead;
  campaigns: Campaign;
};

export const useCampaignLeadsInfinite = (campaignId: number) => {
  const { sortBy, sortOrder } = useLeadsTableStore();

  return useInfiniteQuery<CampaignLeadItem[]>({
    queryKey: ["campaignLeads", campaignId, sortBy, sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(
        `/api/campaigns/${campaignId}/leads?page=${pageParam}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );
      if (!res.ok) throw new Error("Failed to fetch campaign leads");
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage * 20 < lastPage.length ? currentPage : undefined;
    },
    enabled: !!campaignId,
  });
};
