// src/app/dashboard/campaigns/page.tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function CampaignsPage() {
  const { data: campaigns, status } = useQuery({
    queryKey: ['campaigns'],
    queryFn: async () => {
      const res = await fetch('/api/campaigns');
      if (!res.ok) {
        throw new Error('Failed to fetch campaigns');
      }
      return res.json();
    },
  });

  const router = useRouter();

  const handleRowClick = (campaignId: number) => {
    // This is the correct line. It navigates to a URL with the actual ID.
    router.push(`/dashboard/campaigns/${campaignId}`);
  };

  if (status === 'pending') {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Campaigns</h1>
        <Skeleton className="w-full h-[500px]" />
      </div>
    );
  }

  if (status === 'error') {
    return <div className="p-6">Error loading campaigns.</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Campaigns</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" /> Create Campaign
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Campaign Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total Leads</TableHead>
            <TableHead>Successful Leads</TableHead>
            <TableHead>Response Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {campaigns.map((campaign: any) => (
            <TableRow
              key={campaign.id}
              onClick={() => handleRowClick(campaign.id)} // Pass the specific campaign's ID
              className="cursor-pointer"
            >
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>{campaign.status}</TableCell>
              <TableCell>{campaign.totalLeads}</TableCell>
              <TableCell>{campaign.successfulLeads}</TableCell>
              <TableCell>{campaign.responseRate}%</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}