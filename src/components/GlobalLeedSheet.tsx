// app/components/GlobalLeadSheet.tsx
"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useLeadSheetStore } from "@/store/leadSheetStore";

export function GlobalLeadSheet() {
  const { lead, open, closeSheet } = useLeadSheetStore();

  return (
    <Sheet open={open} onOpenChange={closeSheet}>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Lead Details</SheetTitle>
        </SheetHeader>
        {lead ? (
          <div className="p-4 space-y-2">
            <p><strong>Name:</strong> {lead.name}</p>
            <p><strong>Company:</strong> {lead.company}</p>
            <p><strong>Campaign:</strong> {lead.campaign?.name}</p>
            <p><strong>Status:</strong> {lead.status}</p>
          </div>
        ) : (
          <p className="p-4 text-gray-500">No lead selected.</p>
        )}
        <SheetFooter>
          <Button onClick={closeSheet}>Close</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
