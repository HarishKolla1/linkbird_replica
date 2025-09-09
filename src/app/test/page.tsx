// "use client";
// import { useParams } from "next/navigation";
// import { useCampaignLeadsInfinite } from "@/hooks/useCampaignLeads";

// export default function TestCampaignLeads() {
//   const params = useParams();
//   const campaignId = 1 // convert string | undefined to number

//   if (!campaignId) return <div>Invalid campaign ID</div>; // handle missing ID

//   const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
//     useCampaignLeadsInfinite(campaignId);

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Campaign Leads</h1>

//       {status === "pending" && <p>Loading leads...</p>}
//       {status === "error" && <p className="text-red-500">Error fetching leads</p>}

//       <ul className="space-y-2">
//         {data?.pages.flatMap((page) => page.recentLeads).map((lead) => (
//           <li key={lead.id} className="p-2 border rounded">
//             {lead.name} - {lead.company} ({lead.status})
//           </li>
//         ))}
//       </ul>

//       {isFetchingNextPage && <p>Loading more...</p>}

//       {hasNextPage && (
//         <button
//           onClick={() => fetchNextPage()}
//           className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
//         >
//           Load More
//         </button>
//       )}
//     </div>
//   );
// }
