// src/app/dashboard/campaigns/[id]/page.tsx
"use client";
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { authClient } from '@/lib/auth-client';
import { useEffect } from 'react';

export default function CampaignOverviewPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/authenticate'); // Redirect to login if no session
    }
  }, [isPending, session, router]);

  if (isPending || !session) return null; //
  const params = useParams();
  const campaignId = params.id;

  const { data: campaign, status } = useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${campaignId}`);
      return res.json();
    },
  });

  if (status === 'pending') {
    return <Skeleton className="w-full h-[400px]" />;
  }

  if (status === 'error') {
    return <div>Error loading campaign details.</div>;
  }

  return (
    <div className="p-4">
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold">Total Leads</h2>
          <p className="text-3xl">{campaign.totalLeads}</p>
        </div>
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold">Requests Sent</h2>
          <p className="text-3xl">{campaign.totalLeads}</p>
        </div>
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold">Request Accepted</h2>
          <p className="text-3xl">{campaign.successfulLeads}</p>
        </div>
        <div className="bg-muted/50 p-6 rounded-lg">
          <h2 className="text-xl font-bold">Request Replied</h2>
          <p className="text-3xl">{campaign.successfulLeads}</p>
        </div>
      </div>
    </div>
  );
}