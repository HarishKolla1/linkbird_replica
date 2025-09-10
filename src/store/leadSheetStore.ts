// app/store/leadSheetStore.ts
import { create } from "zustand"

type Lead = {
  id: number
  name: string
  company: string
  campaign?: { name: string }
  status: string
}

interface LeadSheetState {
  lead: Lead | null
  open: boolean
  setLead: (lead: Lead) => void
  closeSheet: () => void
}

export const useLeadSheetStore = create<LeadSheetState>((set) => ({
  lead: null,
  open: false,
  setLead: (lead: Lead) => set({ lead, open: true }),
  closeSheet: () => set({ lead: null, open: false }),
}))
