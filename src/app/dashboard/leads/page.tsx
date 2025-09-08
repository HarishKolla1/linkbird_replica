// src/app/dashboard/leads/page.tsx
"use client";

import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { LeadDetailSheet } from '@/components/lead-detail-sheet'; // Import the new component

export default function LeadsPage() {
  const [selectedLeadId, setSelectedLeadId] = useState<number | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const { ref, inView } = useInView();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['leads'],
    queryFn: async ({ pageParam = 0 }) => {
      const res = await fetch(`/api/leads?page=${pageParam}`);
      return res.json();
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length ? allPages.length : undefined;
    },
  });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const allLeads = data?.pages?.flatMap(page => page) || [];

  const handleLeadClick = (leadId: number) => {
    setSelectedLeadId(leadId);
    setIsSheetOpen(true);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Leads</h1>
      {status === 'pending' && <p>Loading...</p>}
      {status === 'error' && <p>Error loading leads.</p>}
      {allLeads.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Contact</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allLeads.map((lead: any) => (
              <TableRow key={lead.leads.id} onClick={() => handleLeadClick(lead.leads.id)} className="cursor-pointer">
                <TableCell>{lead.leads.name}</TableCell>
                <TableCell>{lead.leads.email}</TableCell>
                <TableCell>{lead.leads.company}</TableCell>
                <TableCell>{lead.campaigns.name}</TableCell>
                <TableCell>{lead.leads.status}</TableCell>
                <TableCell>{lead.leads.lastContactDate ? new Date(lead.leads.lastContactDate).toLocaleDateString() : 'N/A'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <div ref={ref}>
        {isFetchingNextPage && <p>Loading more leads...</p>}
      </div>
      {!hasNextPage && (
        <div className="text-center mt-4 text-muted-foreground">
          You've reached the end of the list.
        </div>
      )}

      <LeadDetailSheet
        leadId={selectedLeadId}
        isOpen={isSheetOpen}
        onOpenChange={setIsSheetOpen}
      />
    </div>
  );
}