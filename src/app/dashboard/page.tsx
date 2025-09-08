// src/app/dashboard/page.tsx
"use client";

import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

// You will need to create and export types from your schema.ts
// For this example, we will assume you have a combined type.
type LeadWithInteraction = {
  id: number;
  name: string;
  company: string;
  campaign: { name: string };
  status: string;
  lastInteraction?: {
    timestamp: string;
    action: string;
  } | null;
};

type Campaign = {
  id: number;
  name: string;
  status: string;
};

type DashboardData = {
  totalLeads: number;
  totalCampaigns: number;
  recentLeads: LeadWithInteraction[];
  recentCampaigns: Campaign[];
};

export default function DashboardPage() {
  const { data: dashboardData, status } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard');
      if (!res.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return res.json();
    },
  });

  if (status === 'pending') {
    return (
      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="w-full h-96" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return <div className="p-6">Error loading dashboard.</div>;
  }

  // Helper function to format the timestamp
  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.round((now.getTime() - then.getTime()) / (1000 * 60));
    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    }
    const diffInHours = Math.round(diffInMinutes / 60);
    return `${diffInHours} hrs ago`;
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Campaigns List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {dashboardData.recentCampaigns.map((campaign) => (
                  <li key={campaign.id} className="py-2 border-b last:border-b-0">
                    <Link href={`/dashboard/campaigns/${campaign.id}`} className="hover:underline">
                      <p className="font-medium">{campaign.name}</p>
                      <p className="text-sm text-gray-500">Status: {campaign.status}</p>
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column: Recent Activity Feed */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {dashboardData.recentLeads.map((lead) => (
                  <li key={lead.id} className="py-2 flex items-center gap-4 border-b last:border-b-0">
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-lg font-bold">{lead.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-sm text-gray-500">from {lead.company}</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm font-medium">{lead.campaign.name}</p>
                      <p className="text-xs text-gray-400">Campaign</p>
                    </div>
                    <div className="flex-1 text-right">
                      <p className="text-sm font-medium">{lead.status}</p>
                      {lead.lastInteraction && (
                        <p className="text-xs text-gray-400">
                          {lead.lastInteraction.action} {formatTimeAgo(lead.lastInteraction.timestamp)}
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}