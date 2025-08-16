import React from 'react';
import { MapPin, Phone, Mail, Eye, Edit, Trash2 } from 'lucide-react';

import { StatusBadge } from '../status/StatusBadge';
import { ActionButton } from '../button/ActionButton';
import { UserProps } from '../interface/Notification';

interface UserRowProps {
  user: UserProps;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onView: (id: number) => void;
}

export const UserRow: React.FC<UserRowProps> = ({ user, onEdit, onDelete, onView }) => {
  return (
    <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {user.id}</div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-900 dark:text-gray-100 mb-1">
          <Mail className="h-4 w-4 mr-1" />
          {user.email}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Phone className="h-4 w-4 mr-1" />
          {user.phone}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-1" />
          {user.location}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <StatusBadge status={user.status} />
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
        {user.joinDate}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 text-center">
        {user.emergencyContacts}
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <ActionButton
            icon={Eye}
            onClick={() => onView(user.id)}
            color="blue"
            tooltip="View user"
          />
          <ActionButton
            icon={Edit}
            onClick={() => onEdit(user.id)}
            color="green"
            tooltip="Edit user"
          />
          <ActionButton
            icon={Trash2}
            onClick={() => onDelete(user.id)}
            color="red"
            tooltip="Delete user"
          />
        </div>
      </td>
    </tr>
  );
};
