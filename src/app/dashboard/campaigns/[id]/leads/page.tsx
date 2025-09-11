"use client";

import { useCallback, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useCampaignLeadsInfinite } from "@/hooks/useCampaignLeads";
import { useLeadsTableStore, SortBy, SortOrder } from "@/store/leadsTableStore";
import { cn } from "@/lib/utils";
import { useLeadSheetStore } from "@/store/leadSheetStore"; // ⬅️ import the sheet store
import { authClient } from "@/lib/auth-client";

const statusColors: Record<string, string> = {
  "Follow Up": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Sent": "bg-blue-100 text-blue-800 border-blue-300",
  "Pending Approval": "bg-purple-100 text-purple-800 border-purple-300",
  "Do Not Contact": "bg-red-100 text-red-800 border-red-300",
  "No Status": "bg-gray-100 text-gray-800 border-gray-300",
};

const statusToBars: Record<string, number> = {
  "Sent": 2,
  "Follow Up": 3,
  "Pending": 1,
  "Responded": 2,
  "Pending Approval": 1,
};

export default function CampaignLeadsPage() {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/authenticate'); // Redirect to login if no session
    }
  }, [isPending, session, router]);

  
  const params = useParams();
  const campaignId = Number(params.id);
  const { sortBy, sortOrder, setSorting } = useLeadsTableStore();
  const setLead = useLeadSheetStore((state) => state.setLead); // ⬅️ store action

  if (!campaignId) return <div>Invalid campaign ID</div>;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useCampaignLeadsInfinite(campaignId);

  const observer = useRef<IntersectionObserver | null>(null);

  const lastRowRef = useCallback(
    (node: HTMLTableRowElement) => {
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

  const allLeads =
    data?.pages.flatMap((page) =>
      page.map((item) => ({
        ...item.leads,
        campaign: item.campaigns,
      }))
    ) || [];

  const handleSort = (col: SortBy) => {
    const newOrder: SortOrder =
      sortBy === col && sortOrder === "asc" ? "desc" : "asc";
    setSorting(col, newOrder);
  };

  const getSortIcon = (col: SortBy) => {
    if (sortBy !== col) return null;
    return sortOrder === "asc" ? "↑" : "↓";
  };

  if (isPending || !session) return null;

  return (
    <div className="p-6">
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                onClick={() => handleSort("name")}
                className="cursor-pointer w-[25%]"
              >
                Name {getSortIcon("name")}
              </TableHead>
              <TableHead className="w-[25%]">Lead Description</TableHead>
              <TableHead
                onClick={() => handleSort("status")}
                className="cursor-pointer w-[25%]"
              >
                Activity {getSortIcon("status")}
              </TableHead>
              <TableHead
                onClick={() => handleSort("lastContactDate")}
                className="cursor-pointer w-[25%]"
              >
                Status {getSortIcon("lastContactDate")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {status === "pending" && (
              <TableRow>
                <TableCell colSpan={4} className="text-center">
                  Loading...
                </TableCell>
              </TableRow>
            )}
            {status === "error" && (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-red-500">
                  Error fetching leads
                </TableCell>
              </TableRow>
            )}
            {allLeads.map((lead, index) => {
              const isLast = allLeads.length === index + 1;
              const initials = lead.name?.[0]?.toUpperCase() || "U";

              return (
                <TableRow
                  key={lead.id}
                  ref={isLast ? lastRowRef : null}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => setLead(lead)} // ⬅️ clicking opens sheet
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="align-middle">{lead.company}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1 h-10">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-1 h-6 rounded-sm",
                            i < (statusToBars[lead.status] || 0)
                              ? "bg-green-500"
                              : "bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-md border",
                        statusColors[lead.status.split(" ")[0]] ||
                          statusColors["No Status"]
                      )}
                    >
                      {lead.status}
                    </span>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      {isFetchingNextPage && (
        <p className="text-center mt-4 text-gray-500">Loading more...</p>
      )}
    </div>
  );
}
