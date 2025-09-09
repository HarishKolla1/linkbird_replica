"use client";

import { useState, useRef, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { useCampaignUIStore } from "@/store/campaignTableStore";
import { useCampaigns } from "@/hooks/useCampaignsInfinite";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRouter } from "next/navigation"; // <-- For navigation

// --- Type for campaigns ---
export interface Campaign {
  id: number;
  name: string;
  status: "Active" | "Inactive" | "Draft";
  totalLeads: number;
  successfulLeads: number;
  responded: number;
  responseRate: number;
  createdAt: string;
  userId: string;
}

const queryClient = new QueryClient();

// Icons
const icons = {
  search: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.352l3.41 3.409a.75.75 0 11-1.06 1.06l-3.41-3.41A7 7 0 012 9z"
        clipRule="evenodd"
      />
    </svg>
  ),
  person: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM8.966 6.304a.75.75 0 00-.988 1.182L9.637 9.87a.75.75 0 101.218-.887L9.93 7.859l1.442-1.74a.75.75 0 10-1.134-.942L8.966 6.304zM.918 10a9.073 9.073 0 011.649-4.992.75.75 0 10-1.353-.69l-1.34 2.68a.75.75 0 001.348.675zm18.164-4.992a.75.75 0 00-1.353.69A9.073 9.073 0 0119.082 10a.75.75 0 001.5 0A9.073 9.073 0 00.918 10z"
        clipRule="evenodd"
      />
    </svg>
  ),
  check: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
        clipRule="evenodd"
      />
    </svg>
  ),
  comments: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path
        fillRule="evenodd"
        d="M2.5 5.5A2.5 2.5 0 015 3h10a2.5 2.5 0 012.5 2.5v6.25a.75.75 0 01-1.5 0V5.5c0-.552-.448-1-1-1H5c-.552 0-1 .448-1 1v6.25a.75.75 0 01-1.5 0V5.5zm16 7a.75.75 0 01-.75.75h-.373l-.682 2.046a.75.75 0 01-1.455 0l-.682-2.046H13.5a.75.75 0 010-1.5H16.25a.75.75 0 01.75.75z"
        clipRule="evenodd"
      />
    </svg>
  ),
  link: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M11.986 3.013A.75.75 0 0113 4.28v2.962a.75.75 0 01-1.5 0V4.5a4.5 4.5 0 00-4.5 4.5v1a.75.75 0 01-1.5 0v-1a6 6 0 016-6z" />
      <path d="M8.014 16.987a.75.75 0 01-1.014-1.267v-2.962a.75.75 0 011.5 0v2.742a4.5 4.5 0 004.5-4.5v-1a.75.75 0 011.5 0v1a6 6 0 01-6 6z" />
    </svg>
  ),
};

// Card view for campaigns
const CardView: React.FC<{ campaigns: Campaign[] }> = ({ campaigns }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {campaigns.map((campaign) => (
      <Card key={campaign.id} className="shadow-md rounded-lg p-4 cursor-pointer">
        <CardContent className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
          <div className="flex justify-between items-center">
            <span
              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                campaign.status === "Active"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {campaign.status}
            </span>
            <div className="flex items-center space-x-1 text-gray-500">
              <div className="w-4 h-4">{icons.person}</div>
              <span>{campaign.totalLeads}</span>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-gray-500">
            <div className="w-4 h-4 text-blue-500">{icons.comments}</div>
            <span>Responded: {campaign.responded}</span>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

// Main component
const CampaignDashboard = () => {
  const { activeTab, setActiveTab, searchQuery, setSearchQuery } = useCampaignUIStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useCampaigns();
  const observerTarget = useRef<HTMLTableRowElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) observer.observe(observerTarget.current);

    return () => {
      if (observerTarget.current) observer.unobserve(observerTarget.current);
    };
  }, [observerTarget, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allCampaigns = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-gray-500">Manage your campaigns and track their performance.</p>
          </div>
          <button className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200">
            Create Campaign
          </button>
        </div>

        {/* Tabs + Search */}
        <div className="bg-white p-4 rounded-xl shadow-md">
          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
            <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as typeof activeTab)} className="w-full">
              <TabsList>
                <TabsTrigger value="All Campaigns">All Campaigns</TabsTrigger>
                <TabsTrigger value="Active">Active</TabsTrigger>
                <TabsTrigger value="Inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="relative flex-grow md:flex-grow-0 md:w-80">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icons.search}</span>
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {status === "pending" ? (
          <div className="text-center py-10 text-gray-500">Loading campaigns...</div>
        ) : status === "error" ? (
          <div className="text-center py-10 text-red-500">Error fetching data.</div>
        ) : (
          <Tabs value={activeTab} className="w-full">
            <TabsContent value="All Campaigns">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Campaign Name</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Leads</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Status</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">Connection Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allCampaigns.map((campaign) => {
                      const failed = Math.max(
                        (campaign.totalLeads ?? 0) - (campaign.successfulLeads ?? 0) - (campaign.responded ?? 0),
                        0
                      );

                      return (
                        <tr
                          key={campaign.id}
                          className="hover:bg-gray-50 cursor-pointer"
                          onClick={() => router.push(`campaigns/${campaign.id}`)}
                        >
                          <td className="px-6 py-4 text-center text-sm font-medium text-gray-900">{campaign.name}</td>
                          <td className="px-6 py-4 text-center text-sm">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                campaign.status === "Active"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {campaign.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-500">{campaign.totalLeads}</td>
                          <td className="px-6 py-4 text-center text-sm text-gray-500">
                            <div className="flex justify-center gap-4">
                              <div className="flex items-center gap-1 text-green-500">
                                <div className="w-4 h-4">{icons.check}</div>
                                <span>{campaign.successfulLeads ?? 0}</span>
                              </div>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <div className="w-4 h-4">{icons.comments}</div>
                                <span>{campaign.responded ?? 0}</span>
                              </div>
                              <div className="flex items-center gap-1 text-red-500">
                                <div className="w-4 h-4">{icons.link}</div>
                                <span>{failed}</span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-center text-sm text-gray-500">—</td>
                        </tr>
                      );
                    })}
                    <tr ref={observerTarget} className="h-1" aria-hidden="true" />
                  </tbody>
                </table>

                {isFetchingNextPage && <div className="text-center py-4 text-gray-500">Loading more campaigns...</div>}
                {!hasNextPage && allCampaigns.length > 0 && (
                  <div className="text-center py-4 text-gray-500">You have reached the end.</div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="Active">
              <CardView campaigns={allCampaigns.filter((c) => c.status === "Active")} />
            </TabsContent>

            <TabsContent value="Inactive">
              <CardView campaigns={allCampaigns.filter((c) => c.status === "Inactive")} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CampaignDashboard />
    </QueryClientProvider>
  );
}
