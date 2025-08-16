// Sidebar.tsx
import React from 'react';
import { BarChart3, Bell, Users, Calendar } from 'lucide-react';
import { Notification } from '../interface/Notification';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications?: Notification[];
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, notifications = [] }) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { 
      id: 'notifications', 
      label: 'Notifications', 
      icon: Bell, 
      badge: notifications.filter(n => n.status === 'pending').length 
    },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
  ];

  return (
    <nav className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
              {item.badge && item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};