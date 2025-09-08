// src/hooks/useLeadsInfinite.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { useLeadsTableStore } from "@/store/leadsTableStore";

// --- Types ---
export type Lead = {
  id: number;
  name: string;
  company: string;
  campaign: { name: string };
  status: string;
  lastContactDate: string | null;
};

type LeadsResponse = {
  totalLeads: number;
  recentLeads: Lead[];
};

export const useLeadsInfinite = () => {
  const { sortBy, sortOrder } = useLeadsTableStore();

  return useInfiniteQuery<LeadsResponse>({
    queryKey: ["leads", sortBy, sortOrder],
    queryFn: async ({ pageParam = 0 }) => {
      console.log(
        `[useLeadsInfinite] Fetching leads page=${pageParam}, sortBy=${sortBy}, sortOrder=${sortOrder}`
      );

      const res = await fetch(
        `/api/dashboard/leads?page=${pageParam}&sortBy=${sortBy}&sortOrder=${sortOrder}`
      );

      if (!res.ok) throw new Error("Failed to fetch leads");

      const data = await res.json();
      console.log("[useLeadsInfinite] Response:", data);
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const currentPage = allPages.length;
      return currentPage * 20 < lastPage.totalLeads ? currentPage : undefined;
    },
  });
};
