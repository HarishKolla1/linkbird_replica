"use client";

import { useCallback, useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useLeadsInfinite } from "@/hooks/useLeadsInfinite";
import { useLeadsTableStore, SortBy, SortOrder } from "@/store/leadsTableStore";
import { useLeadSheetStore } from "@/store/leadSheetStore";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";


// Sorting arrow
const SortArrow = ({ active, direction }: { active: boolean; direction: SortOrder }) => {
  if (!active) return null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn(
        "h-4 w-4 transition-transform text-gray-900",
        direction === "desc" && "rotate-180"
      )}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 15 12 9 18 15" />
    </svg>
  );
};


// Status color mapping
// Define rules as an array of { match: (status) => boolean, className: string }
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

// Helper to resolve correct class
const getStatusClass = (status: string): string => {
  const rule = statusRules.find((r) => r.match(status));
  return rule ? rule.className : "bg-gray-100 text-gray-800 border-gray-300"; // default
};

export default function LeadsPage() {

  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/authenticate'); // Redirect to login if no session
    }
  }, [isPending, session, router]);
  const { sortBy, sortOrder, setSorting } = useLeadsTableStore();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } = useLeadsInfinite();
  const { setLead } = useLeadSheetStore();

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
    const newOrder: SortOrder = sortBy === col && sortOrder === "asc" ? "desc" : "asc";
    setSorting(col, newOrder);
  };

    if (isPending || !session) return null; //

  return (
    <div className="p-6">
          <style jsx>{`
    div::-webkit-scrollbar {
      display: none; /* Chrome, Safari, Opera */
    }
  `}</style>

      <div className="max-w-5xl mx-auto">
        <Card>
          <CardContent className="overflow-x-auto">
            <div className="h-[530px] overflow-y-auto scrollbar-hidden">
              <Table className="relative">
                <TableHeader className="sticky top-0 bg-white z-20 shadow-sm">
                  <TableRow>
                    <TableHead
                      onClick={() => handleSort("name")}
                      className="cursor-pointer w-[35%] group sticky left-0 z-30 bg-white"
                    >
                      <div className="flex items-center gap-1">
                        <span>Name</span>
                        <SortArrow direction={sortOrder} active={sortBy === "name"} />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("campaign")}
                      className="cursor-pointer w-[20%] group"
                    >
                      <div className="flex items-center gap-1">
                        <span>Campaign</span>
                        <SortArrow direction={sortOrder} active={sortBy === "campaign"} />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("status")}
                      className="cursor-pointer w-[20%] group"
                    >
                      <div className="flex items-center gap-1">
                        <span>Activity</span>
                        <SortArrow direction={sortOrder} active={sortBy === "status"} />
                      </div>
                    </TableHead>
                    <TableHead
                      onClick={() => handleSort("lastContactDate")}
                      className="cursor-pointer w-[25%] group"
                    >
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <SortArrow direction={sortOrder} active={sortBy === "lastContactDate"} />
                      </div>
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
                        onClick={() => setLead(lead)}
                      >
                        <TableCell className="sticky left-0 z-10 bg-white">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-sky-500 text-white flex items-center justify-center font-bold ">
                              {initials}
                            </div>
                            <div>
                              <p className="font-medium">{lead.name}</p>
                              <p className="text-sm text-gray-500">{lead.company}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{lead.campaign?.name || "-"}</TableCell>
                        <TableCell>
  <div className="flex items-center gap-1 h-6">
    {[0, 1, 2, 3].map((i) => {
      // figure out how many bars should be active
      const count =
        lead.status.toLowerCase().includes("sent") ? 1 :
        lead.status.toLowerCase().includes("follow up") ? 2 :
        lead.status.toLowerCase().includes("pending") ? 3 :
        lead.status.toLowerCase().includes("approved") ? 4 : 0;

      // default gray
      let barColor = "bg-gray-200";

      if (count === 1) barColor = "bg-orange-400"; // brown
      else if (count === 2) barColor = "bg-green-500";
      else if (count === 3) barColor = "bg-blue-500";
      else if (count === 4) barColor = "bg-violet-500";

      return (
        <div
          key={i}
          className={cn("w-1 h-full rounded-sm", i < count ? barColor : "bg-gray-200")}
        />
      );
    })}
  </div>
</TableCell>

<TableCell>
  <span
    className={cn(
      "px-2 py-1 text-xs font-medium rounded-md border",
      getStatusClass(lead.status || "")
    )}
  >
    {lead.status || "No Status"}
  </span>
</TableCell>


                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            {isFetchingNextPage && (
              <div className="flex items-center justify-center gap-2 mt-2 text-gray-500 text-sm h-10">
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
                <span>Loading more</span>
              </div>
            )}
            {!isFetchingNextPage && <div className="h-10" />}  {/* spacer */}

          </CardContent>
        </Card>
      </div>
    </div>
  );
}
