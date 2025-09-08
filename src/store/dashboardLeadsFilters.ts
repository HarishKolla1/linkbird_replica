import { create } from 'zustand';

export type LeadsTimeFilter = 'All' | 'Last 24 Hours' | 'Last 7 Days';

interface LeadsFilterState {
  timeFilter: LeadsTimeFilter;
  setTimeFilter: (filter: LeadsTimeFilter) => void;
}

export const useLeadsFilterStore = create<LeadsFilterState>((set) => ({
  timeFilter: 'All',
  setTimeFilter: (filter) => {
    console.log('[Zustand] Leads time filter changed:', filter);
    set({ timeFilter: filter });
  },
}));
