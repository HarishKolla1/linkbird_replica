// app/leads/page.tsx
"use client";

import { useCallback, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useLeadsInfinite } from "@/hooks/useLeadsInfinite";
import { useLeadsTableStore, SortBy, SortOrder } from "@/store/leadsTableStore";
import { cn } from "@/lib/utils";

// Status color mapping
const statusColors: Record<string, string> = {
  "Follow Up": "bg-yellow-100 text-yellow-800 border-yellow-300",
  "Sent": "bg-blue-100 text-blue-800 border-blue-300",
  "Pending Approval": "bg-purple-100 text-purple-800 border-purple-300",
  "Do Not Contact": "bg-red-100 text-red-800 border-red-300",
  "No Status": "bg-gray-100 text-gray-800 border-gray-300",
};

export default function LeadsPage() {
  const { sortBy, sortOrder, setSorting } = useLeadsTableStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useLeadsInfinite();

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

  const allLeads = data?.pages.flatMap((page) => page.recentLeads) || [];

  const handleSort = (col: SortBy) => {
    const newOrder: SortOrder =
      sortBy === col && sortOrder === "asc" ? "desc" : "asc";
    setSorting(col, newOrder);
  };

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
                Name {sortBy === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </TableHead>
              <TableHead
                onClick={() => handleSort("campaign")}
                className="cursor-pointer w-[25%]"
              >
                Campaign{" "}
                {sortBy === "campaign" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </TableHead>
              <TableHead
                onClick={() => handleSort("status")}
                className="cursor-pointer w-[25%]"
              >
                Activity{" "}
                {sortBy === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
              </TableHead>
              <TableHead
                onClick={() => handleSort("lastContactDate")}
                className="cursor-pointer w-[25%]"
              >
                Status{" "}
                {sortBy === "lastContactDate"
                  ? sortOrder === "asc"
                    ? "↑"
                    : "↓"
                  : ""}
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
                  className="hover:bg-gray-50"
                >
                  {/* Name + Company with profile circle */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold">
                        {initials}
                      </div>
                      <div>
                        <p className="font-medium">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.company}</p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Campaign */}
                  <TableCell className="align-middle">
                    {lead.campaign?.name || "-"}
                  </TableCell>

                  {/* Activity progress bars */}
                  <TableCell>
                    <div className="flex items-center gap-1 h-10">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className={cn(
                            "w-2 h-full rounded-sm",
                            i <
                              (lead.status.toLowerCase().includes("sent")
                                ? 2
                                : lead.status.toLowerCase().includes(
                                    "follow up"
                                  )
                                ? 3
                                : lead.status.toLowerCase().includes("pending")
                                ? 1
                                : 0)
                              ? "bg-green-500"
                              : "bg-gray-200"
                          )}
                        />
                      ))}
                    </div>
                  </TableCell>

                  {/* Status with colored badge */}
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
