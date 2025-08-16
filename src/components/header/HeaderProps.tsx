// Header.tsx
import React from 'react';
import { AlertTriangle, Bell, Settings } from 'lucide-react';
import { Notification } from '../interface/Notification';

interface HeaderProps {
  notifications?: Notification[];
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ notifications = [], onLogout }) => {
  const pendingCount = notifications.filter(n => n.status === 'pending').length;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">SafetyApp Admin</h1>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Bell className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700" />
              {pendingCount > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </div>
            <button className="text-gray-500 hover:text-gray-700">
              <Settings className="h-6 w-6" />
            </button>
            {onLogout && (
              <button
                onClick={onLogout}
                className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};