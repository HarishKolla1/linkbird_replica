'use client';

import { useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useCampaignsInfinite } from '@/hooks/useCampaigns';
import { useCampaignFilterStore, CampaignStatus } from '@/store/campaignDashboardFilters';
import { useLeadsInfinite } from '@/hooks/useDashboardLeads';
import { useLeadsFilterStore, LeadsTimeFilter } from '@/store/dashboardLeadsFilters';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


// --- Types ---
type Campaign = {
  name: string;
  status: 'Draft' | 'Active' | 'Paused' | 'Completed';
};

type Lead = {
  id: number;
  name: string;
  company: string;
  campaign: { name: string };
  status: string;
};

const getStatusClasses = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('follow up')) return 'bg-sky-200 text-sky-800';
  if (s.includes('sent')) return 'bg-green-200 text-green-800';
  if (s.includes('pending approval')) return 'bg-yellow-200 text-yellow-800';
  if (s.includes('do not contact')) return 'bg-gray-200 text-gray-800';
  if (s.includes('converted') || s.includes('responded')) return 'bg-purple-200 text-purple-800';
  return 'bg-gray-100 text-gray-600';
};

const getCampaignStatusClasses = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-200 text-gray-800';
    case 'Active':
      return 'bg-green-200 text-green-800';
    case 'Paused':
      return 'bg-yellow-200 text-yellow-800';
    case 'Completed':
      return 'bg-purple-200 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};




export default function DashboardPage() {
  const { status, setStatus } = useCampaignFilterStore();
  const { timeFilter, setTimeFilter } = useLeadsFilterStore();

  const {
    data: campaignsData,
    fetchNextPage: fetchNextCampaignsPage,
    hasNextPage: hasNextCampaignsPage,
    isFetchingNextPage: isFetchingNextCampaignsPage,
  } = useCampaignsInfinite();

  const {
    data: leadsData,
    fetchNextPage: fetchNextLeadsPage,
    hasNextPage: hasNextLeadsPage,
    isFetchingNextPage: isFetchingNextLeadsPage,
    status: leadsStatus,
  } = useLeadsInfinite();

  const allCampaigns = campaignsData?.pages.flatMap((page) => page) || [];
  const allLeads = leadsData?.pages.flatMap((page) => page.recentLeads) || [];

  const campaignsObserver = useRef<IntersectionObserver | null>(null);
  const leadsObserver = useRef<IntersectionObserver | null>(null);

  const lastCampaignRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextCampaignsPage) return;
      if (campaignsObserver.current) campaignsObserver.current.disconnect();
      campaignsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextCampaignsPage) {
          fetchNextCampaignsPage();
        }
      });
      if (node) campaignsObserver.current.observe(node);
    },
    [isFetchingNextCampaignsPage, hasNextCampaignsPage, fetchNextCampaignsPage]
  );

  const lastLeadRef = useCallback(
    (node: HTMLDivElement) => {
      if (isFetchingNextLeadsPage) return;
      if (leadsObserver.current) leadsObserver.current.disconnect();
      leadsObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextLeadsPage) {
          fetchNextLeadsPage();
        }
      });
      if (node) leadsObserver.current.observe(node);
    },
    [isFetchingNextLeadsPage, hasNextLeadsPage, fetchNextLeadsPage]
  );

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* --- Campaigns --- */}
        <div>
          <Card>
            <CardHeader className="-mb-2 flex items-center justify-between">
              <CardTitle className="text-lg font-bold">Campaigns</CardTitle>
              <Select value={status} onValueChange={(value) => setStatus(value as CampaignStatus)}>
  <SelectTrigger className="w-40">
    <SelectValue placeholder="Select Status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="All">All</SelectItem>
    <SelectItem value="Draft">Draft</SelectItem>
    <SelectItem value="Active">Active</SelectItem>
    <SelectItem value="Paused">Paused</SelectItem>
    <SelectItem value="Completed">Completed</SelectItem>
  </SelectContent>
</Select>

            </CardHeader>
            <CardContent>
              {!campaignsData && isFetchingNextCampaignsPage ? (
                <Skeleton className="w-full h-64" />
              ) : (
                <ul>
                  {allCampaigns.map((campaign, index) => {
                    const isLastElement = allCampaigns.length === index + 1;
                    return (
                      <div
                        ref={isLastElement ? lastCampaignRef : null}
                        key={`${campaign.name}-${index}`}
                      >
                        <li className="py-1.5">
                          <a
                            href={`/dashboard/campaigns/${campaign.name}`}
                            className="hover:underline"
                          >
                            <div className="flex justify-between items-center text-sm">
                              <p className="font-medium">{campaign.name}</p>
                              <p
  className={`inline-block px-2 py-1 rounded text-sm font-medium text-center min-w-[100px] ${getCampaignStatusClasses(campaign.status)}`}
>
  {campaign.status}
</p>

                            </div>
                          </a>
                        </li>
                        {index < allCampaigns.length - 1 && (
                          <Separator className="bg-gray-200/50" />
                        )}
                      </div>
                    );
                  })}
                </ul>
              )}
              {isFetchingNextCampaignsPage && (
                <p className="text-center text-gray-500 mt-2">Loading more campaigns...</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* --- Leads --- */}
        <div>
          <Card>
            <CardHeader className="flex items-center justify-between -mb-2">
              <CardTitle className="text-lg font-bold">Recent Leads</CardTitle>
              <Select
                value={timeFilter}
                onValueChange={(value) => setTimeFilter(value as LeadsTimeFilter)}
              >
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Time Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="Last 24 Hours">Last 24 Hours</SelectItem>
                  <SelectItem value="Last 7 Days">Last 7 Days</SelectItem>
                  <SelectItem value="Last 30 Days">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>

            </CardHeader>
            <CardContent>
              {leadsStatus === 'pending' ? (
                <Skeleton className="w-full h-48" />
              ) : leadsStatus === 'error' ? (
                <div className="text-red-500 p-2 text-sm">Error loading leads.</div>
) : (
  <>
    {/* Leads List */}
    <div className="grid gap-1">
      {/* Headings */}
      <div className="grid grid-cols-3 font-medium text-gray-600 px-2 py-1 text-sm border-b">
        <div>Lead</div>
        <div>Campaign</div>
        <div>Status</div>
      </div>

      {/* Leads rows */}
      {allLeads.map((lead, index) => {
        const isLastElement = allLeads.length === index + 1;
        return (
          <div
            ref={isLastElement ? lastLeadRef : null}
            key={lead.id}
            className="grid grid-cols-3 items-center px-2 py-1 border-b last:border-b-0 text-sm"
          >
            {/* Lead column */}
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sky-300 flex items-center justify-center text-white font-bold text-sm">
                {lead.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col">
                <p className="font-medium">{lead.name}</p>
                <p className="text-gray-500">{lead.company}</p>
              </div>
            </div>

            {/* Campaign column */}
            <div className="font-medium">{lead.campaign.name}</div>

            {/* Status column */}
            <div>
  <span
  className={`inline-block px-2 py-1 rounded text-sm font-medium text-center min-w-[100px] ${getStatusClasses(lead.status)}`}
>
  {lead.status}
</span>

</div>


          </div>
        );
      })}
    </div>
  </>
)}
              {isFetchingNextLeadsPage && (
                <p className="text-center mt-2 text-gray-500 text-sm">Loading more leads...</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
