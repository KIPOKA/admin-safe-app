import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, Settings, X } from 'lucide-react';
import Swal from 'sweetalert2';

export interface Notification {
  id: number;
  status: { id: number; name: string };
  user: { id: number; fullName: string; allergies?: string };
  emergencyType: { id: number; name: string; description: string };
  createdAt: string;
  updatedAt?: string;
  message?: string;
  timestamp?: string;
}

// ================= PROPS =================
interface HeaderProps {
  onLogout?: () => void;
}

// ================= COMPONENT =================
export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const API_BASE_URL = 'http://localhost:3000/api/notifications';

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showNotificationPanel, setShowNotificationPanel] = useState(false);
  const [showSettingsPanel, setShowSettingsPanel] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Fetch notifications from API
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
   
      // Assume your API returns { notifications: [...] }
      setNotifications(data.notifications);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Optional: poll every 30 seconds
    const interval = setInterval(fetchNotifications, 3000);
    return () => clearInterval(interval);
  }, []);

  // Filter pending notifications
  const pendingNotifications = notifications
    .filter((n) => n.status.name.toLowerCase() === 'pending')
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const newestNotification = pendingNotifications[0];

  // Apply theme
  useEffect(() => {
    if (theme === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [theme]);

  const handleLogoutClick = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to logout?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed && onLogout) onLogout();
    });
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString();
  };

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm border-b border-gray-200 dark:border-gray-700 relative">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Ubuntu Safety Admin
          </h1>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <Bell
              className="h-6 w-6 text-gray-500 dark:text-gray-300 cursor-pointer hover:text-gray-700 dark:hover:text-gray-100"
              onClick={() => setShowNotificationPanel(true)}
            />
            {pendingNotifications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-xs text-white flex items-center justify-center">
                {pendingNotifications.length}
              </span>
            )}
          </div>

          {/* Settings */}
          <button
            className="text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100"
            onClick={() => setShowSettingsPanel(true)}
          >
            <Settings className="h-6 w-6" />
          </button>

          {/* Logout */}
          {onLogout && (
            <button
              onClick={handleLogoutClick}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-600"
            >
              Logout
            </button>
          )}
        </div>

        {/* Notification Panel */}
        {showNotificationPanel && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="absolute inset-0 bg-black bg-opacity-30"
              onClick={() => setShowNotificationPanel(false)}
            />
            <div className="relative w-96 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Pending Notifications
                </h2>
                <button onClick={() => setShowNotificationPanel(false)}>
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" />
                </button>
              </div>
              <div className="p-4 space-y-3">
                {loading && <p>Loading...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {pendingNotifications.length === 0 && !loading && (
                  <p className="text-gray-500 dark:text-gray-300">No pending notifications.</p>
                )}
                {pendingNotifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`p-3 rounded-lg shadow-sm ${
                      notif.id === newestNotification?.id
                        ? 'bg-blue-50 dark:bg-blue-900'
                        : 'bg-gray-50 dark:bg-gray-700'
                    }`}
                  >
                    <p className="text-gray-900 dark:text-gray-100 font-semibold">
                      {notif.user.fullName} - {notif.emergencyType.name}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {notif.emergencyType.description}
                    </p>
                    <p className="text-gray-400 dark:text-gray-400 text-xs">
                      {formatTimestamp(notif.createdAt)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Settings Panel */}
        {showSettingsPanel && (
          <div className="fixed inset-0 z-50 flex justify-end">
            <div
              className="absolute inset-0 bg-black bg-opacity-30"
              onClick={() => setShowSettingsPanel(false)}
            />
            <div className="relative w-96 bg-white dark:bg-gray-800 shadow-lg overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  Application Settings
                </h2>
                <button onClick={() => setShowSettingsPanel(false)}>
                  <X className="h-5 w-5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-100" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Theme
                  </label>
                  <select
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md p-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={theme}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
