'use client';

import { useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

import { useCampaignsInfinite } from '@/hooks/useCampaigns';
import { useCampaignFilterStore, CampaignStatus } from '@/store/campaignDashboardFilters';
import { useLeadsInfinite } from '@/hooks/useDashboardLeads';
import { useLeadsFilterStore, LeadsTimeFilter } from '@/store/dashboardLeadsFilters';

import { useLeadSheetStore } from "@/store/leadSheetStore";
import { GlobalLeadSheet } from '@/components/GlobalLeedSheet';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

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

const linkedInAccounts = [
  {
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    status: "Connected",
    requests: 25,
    totalRequests: 50,
  },
  {
    name: "Riya Singh",
    email: "riya.singh@example.com",
    status: "Connected",
    requests: 32,
    totalRequests: 50,
  },
  {
    name: "Vikram Kumar",
    email: "vikram.k@example.com",
    status: "Connected",
    requests: 15,
    totalRequests: 25,
  },
];

const statusRules: { match: (status: string) => boolean; className: string }[] = [
  { match: (s) => s.toLowerCase().startsWith("follow up"), className: "bg-blue-100 text-blue-800 border-blue-300" },
  { match: (s) => s.toLowerCase().includes("sent"), className: "bg-orange-100 text-orange-800 border-orange-300" },
  { match: (s) => s.toLowerCase().includes("pending"), className: "bg-purple-100 text-purple-800 border-purple-300" },
  { match: (s) => s.toLowerCase().includes("do not"), className: "bg-red-100 text-red-800 border-red-300" },
  { match: (s) => s.toLowerCase().includes("approved"), className: "bg-green-100 text-green-800 border-green-300" },
  { match: (s) => s.toLowerCase().includes("rejected"), className: "bg-orange-100 text-orange-800 border-orange-300" },
  { match: (s) => s.toLowerCase().includes("progress"), className: "bg-sky-100 text-sky-800 border-sky-300" },
  { match: (s) => s.toLowerCase().includes("completed"), className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
];
const getStatusClass = (status: string): string => {
  const normalized = status.toLowerCase();
  const rule = statusRules.find((r) => r.match(normalized));
  return rule ? rule.className : "bg-gray-100 text-gray-600 border-gray-300"; // fallback
};

const getCampaignStatusClasses = (status: string) => {
  switch (status) {
    case 'Draft':
      return 'bg-gray-100 text-gray-800';
    case 'Active':
      return 'bg-green-100 text-green-800';
    case 'Paused':
      return 'bg-yellow-100 text-yellow-800';
    case 'Completed':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-600';
  }
};

export default function DashboardPage() {

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

 


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

  const setLead = useLeadSheetStore((s) => s.setLead);

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
   useEffect(() => {
    if (!isPending && !session) {
      router.push('/authenticate'); // Redirect to login if no session
    }
  }, [isPending, session, router]);

  if (isPending || !session) return null; // Optionally, show a loading state

  return (
    <div className="p-4">
      <style>{`
        .scrollbar-hidden::-webkit-scrollbar {
          width: 0;
          height: 0;
        }
        .scrollbar-hidden {
          scrollbar-width: none;
        }
      `}</style>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column Container (Campaigns and LinkedIn Accounts) */}
        <div className="flex flex-col gap-4">
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
                <div className="h-[250px] overflow-y-auto scrollbar-hidden pr-2">
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
                    <div className="flex items-center justify-center gap-2 mt-2 text-gray-500 text-sm">
                      <svg
                        className="animate-spin h-4 w-4 text-gray-500"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
                        ></path>
                      </svg>
                      <span>Loading more...</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* --- LinkedIn Accounts --- */}
          <div>
            <Card>
              <CardHeader className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold">LinkedIn Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[150px] overflow-y-auto scrollbar-hidden pr-2">
                  {linkedInAccounts.map((account, index) => (
                    <div key={index}>
                      <div className="flex items-center justify-between py-2">
                        <div className="flex items-center gap-2">
                          {/* Profile icon with first letter */}
                          <div className="w-8 h-8 rounded-full bg-sky-300 flex items-center justify-center text-white font-bold text-sm">
                            {account.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex flex-col">
                            <p className="font-medium text-sm">{account.name}</p>
                            <p className="text-gray-500 text-xs">{account.email}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <span className="text-blue-600">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.144 1.066l-6 8a.75.75 0 01-1.071.056l-3.5-3.5A.75.75 0 117.5 9.5l3.5 3.5 5.25-7A.75.75 0 0116.704 4.153z" clipRule="evenodd" />
                              </svg>
                            </span>
                            <span className="text-blue-800">Connected</span>
                          </div>
                          <p className="text-gray-600 text-xs mt-1">
                            {account.requests}/{account.totalRequests} Requests
                          </p>
                        </div>
                      </div>
                      {index < linkedInAccounts.length - 1 && (
                        <Separator className="bg-gray-200/50" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* --- Leads (Right Column) --- */}
        <div>
          <Card className="h-full">
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
                <Skeleton className="w-full h-[520px]" />
              ) : leadsStatus === 'error' ? (
                <div className="text-red-500 p-2 text-sm">Error loading leads.</div>
              ) : (
                <>
                  <div className="h-[500px] overflow-y-auto scrollbar-hidden pr-2">
                    <div className="grid gap-1">
                      <div className="grid grid-cols-3 font-medium text-gray-600 px-2 py-1 text-sm border-b">
                        <div>Lead</div>
                        <div>Campaign</div>
                        <div>Status</div>
                      </div>

                      {allLeads.map((lead, index) => {
                        const isLastElement = allLeads.length === index + 1;
                        return (
                          <div
                            ref={isLastElement ? lastLeadRef : null}
                            key={lead.id}
                            className="grid grid-cols-3 items-center px-2 py-2 border-b last:border-b-0 text-sm cursor-pointer hover:bg-gray-50"
                            onClick={() => setLead(lead)}
                          >
                            <div className="flex items-center gap-2">
                              <div className="w-10 h-10 rounded-full bg-sky-300 flex items-center justify-center text-white font-bold text-sm">
                                {lead.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="flex flex-col">
                                <p className="font-medium">{lead.name}</p>
                                <p className="text-gray-500">{lead.company}</p>
                              </div>
                            </div>

                            <div className="font-medium">{lead.campaign.name}</div>

                            <div>
                              <span
                                className={`inline-block px-2 py-1 rounded text-sm font-medium text-center min-w-[100px] ${getStatusClass(lead.status || "")}`}
                              >
                                {lead.status || "No Status"}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              )}
              {isFetchingNextLeadsPage && (
                <div className="flex items-center justify-center gap-2 mt-2 text-gray-500 text-sm">
                  <svg
                    className="animate-spin h-4 w-4 text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v2a6 6 0 00-6 6H4z"
                    ></path>
                  </svg>
                  <span>Loading more...</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Global Lead Sheet (always mounted) */}
      <GlobalLeadSheet />
    </div>
  );
}