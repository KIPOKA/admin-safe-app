// StatsCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: 'blue' | 'red' | 'green' | 'orange';
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
}) => {
  const colorMap = {
    blue: 'text-blue-500 dark:text-blue-400',
    red: 'text-red-500 dark:text-red-400',
    green: 'text-green-500 dark:text-green-400',
    orange: 'text-orange-500 dark:text-orange-400',
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{value}</p>
        </div>
        <Icon className={`h-10 w-10 ${colorMap[color]}`} />
      </div>
    </div>
  );
};
