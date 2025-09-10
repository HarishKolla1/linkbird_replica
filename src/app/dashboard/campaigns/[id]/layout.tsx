// src/app/dashboard/campaigns/[id]/layout.tsx
import { ReactNode } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function CampaignDetailsLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { id: string };
}) {
  const campaignId = params?.id ?? ''; // fallback just in case

  return (
    <div className="p-6">
      <div className="flex items-center space-x-4 mb-4">
        <h1 className="text-3xl font-bold">Campaign Details</h1>
      </div>
      <Separator className="my-4" />

      <div className="flex justify-between items-center">
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <Link href={`/dashboard/campaigns/${campaignId}`}>
              <TabsTrigger value="overview">Overview</TabsTrigger>
            </Link>
            <Link href={`/dashboard/campaigns/${campaignId}/leads`}>
              <TabsTrigger value="leads">Leads</TabsTrigger>
            </Link>
            <Link href={`/dashboard/campaigns/${campaignId}/sequence`}>
              <TabsTrigger value="sequence">Sequence</TabsTrigger>
            </Link>
            <Link href={`/dashboard/campaigns/${campaignId}/settings`}>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </Link>
          </TabsList>
        </Tabs>
      </div>
      <Separator className="my-4" />
      {children}
    </div>
  );
}
