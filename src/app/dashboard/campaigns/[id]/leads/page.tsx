// src/app/dashboard/campaigns/[id]/leads/page.tsx
"use client";

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';

// (Note: you will need to create a new API endpoint for this: /api/campaigns/[id]/leads)
export default function CampaignLeadsPage() {
  const params = useParams();
  const campaignId = params.id;

  const { data: leads, status } = useQuery({
    queryKey: ['campaign-leads', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}/leads`);
      if (!res.ok) {
        throw new Error('Failed to fetch leads for this campaign');
      }
      return res.json();
    },
  });

  if (status === 'pending') {
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (status === 'error') {
    return <div>Error loading leads.</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leads in this Campaign</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Company</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads.map((lead: any) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.name}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.company}</TableCell>
              <TableCell>{lead.status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}