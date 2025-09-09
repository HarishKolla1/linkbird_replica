// lib/statusClasses.ts

export const getStatusClasses = (status: string) => {
  const s = status.toLowerCase();
  if (s.includes('follow up')) return 'bg-sky-200 text-sky-800';
  if (s.includes('sent')) return 'bg-green-200 text-green-800';
  if (s.includes('pending approval')) return 'bg-yellow-200 text-yellow-800';
  if (s.includes('do not contact')) return 'bg-gray-200 text-gray-800';
  if (s.includes('converted') || s.includes('responded')) return 'bg-purple-200 text-purple-800';
  return 'bg-gray-100 text-gray-600';
};

export const getCampaignStatusClasses = (status: string) => {
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
