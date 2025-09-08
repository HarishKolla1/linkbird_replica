// src/app/dashboard/page.tsx
"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRef, useCallback } from "react";

// Types
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

type DashboardDataPage = {
  totalLeads: number;
  totalCampaigns: number;
  recentLeads: LeadWithInteraction[];
  recentCampaigns: Campaign[];
};

export default function DashboardPage() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery<DashboardDataPage>({
      queryKey: ["dashboard"],
      queryFn: async ({ pageParam = 0 }) => {
        const res = await fetch(`/api/dashboard?page=${pageParam}`);
        if (!res.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        return res.json();
      },
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages) => {
        const currentPage = allPages.length;
        return currentPage * 10 < lastPage.totalLeads
          ? currentPage
          : undefined;
      },
    });

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback(
    (node: HTMLLIElement) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, hasNextPage, fetchNextPage]
  );

  if (status === "pending") {
    return (
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-1">
          <Skeleton className="w-full h-96" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="w-full h-96" />
        </div>
      </div>
    );
  }

  if (status === "error") {
    return <div className="p-6">Error loading dashboard.</div>;
  }

  const allRecentLeads =
    data?.pages.flatMap((page) => page.recentLeads) || [];
  const allRecentCampaigns =
    data?.pages.flatMap((page) => page.recentCampaigns) || [];

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffInMinutes = Math.round(
      (now.getTime() - then.getTime()) / (1000 * 60)
    );
    if (diffInMinutes < 60) {
      return `${diffInMinutes} mins ago`;
    }
    const diffInHours = Math.round(diffInMinutes / 60);
    return `${diffInHours} hrs ago`;
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Campaigns List with infinite scroll */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="-mb-4">
              <CardTitle className="text-xl font-bold">Campaigns</CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {allRecentCampaigns.map((campaign, index) => {
                  const isLastElement =
                    allRecentCampaigns.length === index + 1;
                  return (
                    <li
                      ref={isLastElement ? lastElementRef : null}
                      key={campaign.id}
                      className="py-4"
                    >
                      <Link
                        href={`/dashboard/campaigns/${campaign.id}`}
                        className="hover:underline"
                      >
                        <div className="flex justify-between items-center">
                          <p className="font-medium">{campaign.name}</p>
                          <p className="text-sm text-gray-500">
                            {campaign.status}
                          </p>
                        </div>
                      </Link>

                      {/* Separator */}
                      {index < allRecentCampaigns.length - 1 && (
                        <Separator className="w-full bg-gray-200 mt-4 h-px" />
                      )}
                    </li>
                  );
                })}
              </ul>
              {isFetchingNextPage && (
                <p className="text-center text-gray-500 mt-4">
                  Loading more...
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Recent Activity Feed with infinite scroll */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul>
                {allRecentLeads.map((lead, index) => {
                  const isLastElement = allRecentLeads.length === index + 1;
                  return (
                    <li
                      ref={isLastElement ? lastElementRef : null}
                      key={lead.id}
                      className="py-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-lg font-bold">
                            {lead.name.charAt(0)}
                          </span>
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{lead.name}</p>
                          <p className="text-sm text-gray-500">
                            from {lead.company}
                          </p>
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-sm font-medium">
                            {lead.campaign.name}
                          </p>
                          <p className="text-xs text-gray-400">Campaign</p>
                        </div>
                        <div className="flex-1 text-right">
                          <p className="text-sm font-medium">{lead.status}</p>
                          {lead.lastInteraction && (
                            <p className="text-xs text-gray-400">
                              {lead.lastInteraction.action}{" "}
                              {formatTimeAgo(lead.lastInteraction.timestamp)}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Separator */}
                      {index < allRecentLeads.length - 1 && (
                        <Separator className="w-full bg-gray-200 mt-4 h-px" />
                      )}
                    </li>
                  );
                })}
              </ul>
              {isFetchingNextPage && (
                <p className="text-center text-gray-500 mt-4">
                  Loading more...
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
