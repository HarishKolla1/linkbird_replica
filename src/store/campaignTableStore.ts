// stores/campaignTableStore.ts
import  {create } from "zustand";

type Tab = "All Campaigns" | "Active" | "Inactive";

interface CampaignUIState {
  activeTab: Tab;
  setActiveTab: (t: Tab) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  pageSize: number;
}

export const useCampaignUIStore = create<CampaignUIState>((set) => ({
  activeTab: "All Campaigns",
  setActiveTab: (t) => set({ activeTab: t }),
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  pageSize: 10,
}));
