// app/test/leads-hook/page.tsx
"use client";

import { useLeadsInfinite } from "@/hooks/useLeadsInfinite";
import { useLeadsTableStore } from "@/store/leadsTableStore";

export default function LeadsHookTest() {
  const { sortBy, sortOrder, setSorting } = useLeadsTableStore();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useLeadsInfinite();

  if (status === "pending") return <p>Loading...</p>;
  if (status === "error") return <p>Error fetching leads</p>;

  const allLeads = data?.pages.flatMap((page) => page.recentLeads) || [];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Test Leads Hook</h1>

      {/* Sorting controls */}
      <div className="flex gap-4">
        <select
          value={sortBy}
          onChange={(e) => setSorting(e.target.value as any, sortOrder)}
          className="border px-2 py-1 rounded"
        >
          <option value="name">Name</option>
          <option value="campaign">Campaign</option>
          <option value="status">Status</option>
          <option value="lastContactDate">Last Contact</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSorting(sortBy, e.target.value as any)}
          className="border px-2 py-1 rounded"
        >
          <option value="asc">Asc</option>
          <option value="desc">Desc</option>
        </select>
      </div>

      {/* Lead list */}
      <ul className="space-y-2">
        {allLeads.map((lead) => (
          <li
            key={lead.id}
            className="border rounded p-3 flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{lead.name}</p>
              <p className="text-sm text-gray-500">{lead.company}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium">{lead.campaign?.name}</p>
              <p className="text-xs text-gray-400">{lead.status}</p>
            </div>
          </li>
        ))}
      </ul>

      {/* Load more */}
      {hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {isFetchingNextPage ? "Loading..." : "Load More"}
        </button>
      )}
    </div>
  );
}
