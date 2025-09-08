// src/components/lead-detail-sheet.tsx
"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@/components/ui/skeleton';

type LeadDetailSheetProps = {
  leadId: number | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export function LeadDetailSheet({ leadId, isOpen, onOpenChange }: LeadDetailSheetProps) {
  const { data: lead, status } = useQuery({
    queryKey: ['lead', leadId],
    queryFn: async () => {
      if (!leadId) return null;
      const res = await fetch(`/api/leads/${leadId}`);
      return res.json();
    },
    enabled: !!leadId, // Only run the query if a leadId is present
  });

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Lead Profile</SheetTitle>
        </SheetHeader>
        {status === 'pending' && <Skeleton className="w-full h-[600px]" />}
        {status === 'error' && <div>Error fetching lead data.</div>}
        {lead && (
          <div className="py-4">
            <h2 className="text-xl font-bold">{lead.name}</h2>
            <p className="text-sm text-gray-500 mb-4">{lead.company}</p>

            <h3 className="text-lg font-semibold mt-6">Interaction History</h3>
            <div className="space-y-4 mt-2">
              {/* You can map over lead.interactionHistory here if you populate it */}
              <div className="border-l-2 pl-4 border-blue-500">
                <p className="font-medium">Initial Outreach</p>
                <p className="text-sm text-gray-600">Sent an invitation message.</p>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}