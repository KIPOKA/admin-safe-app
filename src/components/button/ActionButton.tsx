import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon: LucideIcon;
  onClick: () => void;
  color?: 'blue' | 'green' | 'red' | 'gray';
  size?: 'sm' | 'md';
  tooltip?: string;
}

export const ActionButton: React.FC<ActionButtonProps> = ({ 
  icon: Icon, 
  onClick, 
  color = 'blue',
  size = 'md',
  tooltip
}) => {
  // Map colors for light and dark mode
  const colorMap = {
    blue: 'text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200',
    green: 'text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200',
    red: 'text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200',
    gray: 'text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200',
  };

  const sizeMap = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
  };

  return (
    <button
      onClick={onClick}
      className={`${colorMap[color]} transition-colors`}
      title={tooltip}
    >
      <Icon className={sizeMap[size]} />
    </button>
  );
};
