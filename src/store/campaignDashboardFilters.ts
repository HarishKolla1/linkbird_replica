import { create } from 'zustand';

export type CampaignStatus = 'All' | 'Draft' | 'Active' | 'Paused' | 'Completed';

interface CampaignFilterStore {
  status: CampaignStatus;
  setStatus: (status: CampaignStatus) => void;
}

export const useCampaignFilterStore = create<CampaignFilterStore>((set) => ({
  status: 'All',
  setStatus: (status) => set({ status }),
}));
