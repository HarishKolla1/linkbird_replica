import { create } from "zustand";

// Types for sorting
export type SortBy = "name" | "campaign" | "status" | "lastContactDate";
export type SortOrder = "asc" | "desc";

type LeadsTableStore = {
  sortBy: SortBy;
  sortOrder: SortOrder;
  setSortBy: (sortBy: SortBy) => void;
  setSortOrder: (sortOrder: SortOrder) => void;
  setSorting: (sortBy: SortBy, sortOrder: SortOrder) => void;
};

export const useLeadsTableStore = create<LeadsTableStore>((set) => ({
  sortBy: "lastContactDate", // default sort by latest
  sortOrder: "desc",
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (sortOrder) => set({ sortOrder }),
  setSorting: (sortBy, sortOrder) => set({ sortBy, sortOrder }),
}));
