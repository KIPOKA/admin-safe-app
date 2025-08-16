// utils.ts
export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-800';
    case 'inactive':
      return 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-800';
    case 'pending':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-800';
    case 'resolved':
      return 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-800';
    case 'scheduled':
      return 'text-blue-600 bg-blue-100 dark:text-blue-200 dark:bg-blue-800';
    case 'in-progress':
      return 'text-orange-600 bg-orange-100 dark:text-orange-200 dark:bg-orange-800';
    case 'completed':
      return 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-800';
    case 'dismissed':
      return 'text-gray-600 bg-gray-100 dark:text-gray-200 dark:bg-gray-800';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-200 dark:bg-gray-800';
  }
};

export const getUrgencyColor = (urgency: string): string => {
  switch (urgency) {
    case 'high':
      return 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-800';
    case 'medium':
      return 'text-yellow-600 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-800';
    case 'low':
      return 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-800';
    default:
      return 'text-gray-600 bg-gray-100 dark:text-gray-200 dark:bg-gray-800';
  }
};
