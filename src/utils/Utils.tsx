// utils.ts
export const getStatusColor = (status: string): string => {
  switch(status) {
    case 'active': return 'text-green-600 bg-green-100';
    case 'inactive': return 'text-red-600 bg-red-100';
    case 'pending': return 'text-yellow-600 bg-yellow-100';
    case 'resolved': return 'text-green-600 bg-green-100';
    case 'scheduled': return 'text-blue-600 bg-blue-100';
    case 'in-progress': return 'text-orange-600 bg-orange-100';
    case 'completed': return 'text-green-600 bg-green-100';
    case 'dismissed': return 'text-gray-600 bg-gray-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};

export const getUrgencyColor = (urgency: string): string => {
  switch(urgency) {
    case 'high': return 'text-red-600 bg-red-100';
    case 'medium': return 'text-yellow-600 bg-yellow-100';
    case 'low': return 'text-green-600 bg-green-100';
    default: return 'text-gray-600 bg-gray-100';
  }
};