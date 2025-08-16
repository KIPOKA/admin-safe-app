// UrgencyBadge.tsx
import React from 'react';
import { getUrgencyColor } from '../../utils/Utils';

interface UrgencyBadgeProps {
  urgency: 'high' | 'medium' | 'low';
}

export const UrgencyBadge: React.FC<UrgencyBadgeProps> = ({ urgency }) => {
  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(urgency)}`}>
      {urgency.toUpperCase()}
    </span>
  );
};