import React from "react";

type UrgencyLevel = "high" | "medium" | "low" | string;
interface UrgencyBadgeProps {
  urgency: UrgencyLevel;
}


export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  const getUrgencyStyle = (urgency: UrgencyLevel): string => {
    switch (urgency.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700";
      case "low":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600";
    }
  };

  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyStyle(
        urgency
      )}`}
    >
      {urgency.toUpperCase()}
    </span>
  );
};


export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
      case 'read':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700';
      default:
        return 'bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900 dark:text-purple-200 dark:border-purple-700';
    }
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusStyle(status)}`}>
      {status.toUpperCase()}
    </span>
  );
}; 

// ActionButton
export const ActionButton: React.FC<{
  icon: React.ComponentType<any>;
  onClick: () => void;
  color: string;
  tooltip: string;
}> = ({ icon: Icon, onClick, color, tooltip }) => {
  const getColorStyle = (color: string) => {
    switch (color) {
      case 'green':
        return 'text-green-600 hover:bg-green-50 dark:text-green-400 dark:hover:bg-green-900';
      case 'blue':
        return 'text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900';
      case 'red':
        return 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900';
      default:
        return 'text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-gray-700';
    }
  };
  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-lg transition-colors duration-200 ${getColorStyle(color)}`}
      title={tooltip}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
};

