import React, { useState, useEffect } from 'react';
import { RefreshCw, Bell, XCircle, MapPin, AlertTriangle } from 'lucide-react';
import Swal from 'sweetalert2';
import { ApiNotification, DisplayNotification, TableSectionProps } from '../interface/Notification';
import NotificationDetails from './NotificationDetails';

const NotificationProps: React.FC = () => {
  const [notifications, setNotifications] = useState<DisplayNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const API_BASE_URL = 'http://localhost:3000/api/notifications';

  // --- Convert API notification to display notification ---
  const convertApiNotification = (apiNotification: ApiNotification): DisplayNotification => {
    const getUrgency = (emergencyType: string): string => {
      const type = emergencyType.toLowerCase();
      if (type.includes("fire") || type.includes("medical") || type.includes("accident") || type.includes("crime") || type.includes("animal")) return "high";
      if (type.includes("missing") || type.includes("hazardous") || type.includes("fall") || type.includes("power")) return "medium";
      return "low";
    };

    const formatTimestamp = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return "Just now";
      if (minutes < 60) return `${minutes}m ago`;
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
      return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    };

    return {
      notificationId: apiNotification.notification_id,
      user: apiNotification.user.fullName,
      type: apiNotification.emergencyType.name,
      message: apiNotification.emergencyType.description,
      location: apiNotification.location
        ? {
            id: apiNotification.location.id ?? apiNotification.notification_id,
            city: apiNotification.location.city ?? "Unknown City",
            country: apiNotification.location.country ?? "Unknown Country",
            latitude: apiNotification.location.latitude ?? 0,
            longitude: apiNotification.location.longitude ?? 0,
            description: apiNotification.location.description ?? "",
          }
        : {
            id: apiNotification.notification_id,
            city: "Unknown City",
            country: "Unknown Country",
            latitude: 0,
            longitude: 0,
            description: "",
          },
      urgency: getUrgency(apiNotification.emergencyType.name),
      status: apiNotification.status.name.toLowerCase(),
      timestamp: formatTimestamp(apiNotification.createdAt),
      userData: apiNotification.user,
      emergencyType: apiNotification.emergencyType,
    };
  };

  // --- Fetch notifications ---
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/`);
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json(); 
      console.log(data)
      setNotifications(data.notifications.map(convertApiNotification));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  // --- Status update handler ---
  const handleStatusUpdate = async (id: number, status: string): Promise<void> => {
    try {
      const statusMap: { [key: string]: number } = {
        pending: 1,
        read: 2,
        resolved: 3,
        dismissed: 4,
      };

      const statusId = statusMap[status.toLowerCase()];
      if (!statusId) throw new Error("Invalid status");

      let resolutionMessage: string | undefined;

      if (status.toLowerCase() === "resolved" || status.toLowerCase() === "dismissed") {
        const { value } = await Swal.fire({
          title: `Enter how this notification was ${status}`,
          input: "textarea",
          inputPlaceholder: "Type resolution details here...",
          showCancelButton: true,
          confirmButtonText: "Submit",
          cancelButtonText: "Cancel",
        });

        if (!value) return;
        resolutionMessage = value;
      }

      const response = await fetch(`${API_BASE_URL}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          notificationId: id,
          statusId,
          message: resolutionMessage || "",
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update status");
      }

      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationId === id
            ? { ...n, status, resolutionMessage: resolutionMessage ?? n.resolutionMessage }
            : n
        )
      );
    } catch (err) {
      console.error("Status update error:", err);
      setError(err instanceof Error ? err.message : "Status update failed");
    }
  };

  // --- Delete notification ---
  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${API_BASE_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to delete notification');
      setNotifications(prev => prev.filter(n => n.notificationId !== id));
    } catch (err) {
      console.error(err);
      alert('Failed to delete notification');
    }
  };

  // --- Filtering & sorting ---
  const parseTimestampToDate = (timestamp: string): Date | null => {
    if (timestamp === 'Just now') return new Date();
    const relativeMatch = timestamp.match(/^(\d+)([mh])\s+ago$/);
    if (relativeMatch) {
      const value = parseInt(relativeMatch[1]);
      const unit = relativeMatch[2];
      const date = new Date();
      if (unit === 'm') date.setMinutes(date.getMinutes() - value);
      else if (unit === 'h') date.setHours(date.getHours() - value);
      return date;
    }
    const parsed = new Date(timestamp);
    return isNaN(parsed.getTime()) ? null : parsed;
  };

// Add state for sorting
const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

// Update getFilteredNotifications

const getFilteredNotifications = () => {
  let filtered = notifications;

  // Filter by status
  if (filter !== 'all') filtered = filtered.filter(n => n.status === filter);

  // Filter by date (today, yesterday, last7days, etc.)
  if (dateFilter !== 'all') {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    filtered = filtered.filter(n => {
      const notificationDate = parseTimestampToDate(n.timestamp);
      if (!notificationDate) return false;
      const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());
      switch (dateFilter) {
        case 'today': return notificationDay.getTime() === today.getTime();
        case 'yesterday': {
          const yesterday = new Date(today);
          yesterday.setDate(yesterday.getDate() - 1);
          return notificationDay.getTime() === yesterday.getTime();
        }
        case 'last7days': {
          const sevenDaysAgo = new Date(today);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          return notificationDate >= sevenDaysAgo;
        }
        case 'last30days': {
          const thirtyDaysAgo = new Date(today);
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          return notificationDate >= thirtyDaysAgo;
        }
        case 'thisweek': {
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          return notificationDate >= startOfWeek;
        }
        case 'thismonth': {
          const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          return notificationDate >= startOfMonth;
        }
        default: return true;
      }
    });
  }

  const urgencyOrder: { [key: string]: number } = { high: 1, medium: 2, low: 3 };
  const statusOrder: { [key: string]: number } = { pending: 1, read: 2, resolved: 3, dismissed: 4 };

  return [...filtered].sort((a, b) => {
    const dateA = parseTimestampToDate(a.timestamp)?.getTime() ?? 0;
    const dateB = parseTimestampToDate(b.timestamp)?.getTime() ?? 0;

    if (sortOrder === 'newest') return dateB - dateA;
    if (sortOrder === 'oldest') return dateA - dateB;

    // Default sorting: urgency → status → date
    const urgencyCompare = (urgencyOrder[a.urgency] || 99) - (urgencyOrder[b.urgency] || 99);
    if (urgencyCompare !== 0) return urgencyCompare;

    const statusCompare = (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99);
    if (statusCompare !== 0) return statusCompare;

    return dateB - dateA; // newest first as tie breaker
  });
};

  // --- Notification stats ---
  const totalCount = notifications.length;
  const statusCounts = notifications.reduce((acc, n) => {
    acc[n.status] = (acc[n.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const filteredNotifications = getFilteredNotifications();
  const activeNotifications = filteredNotifications.filter(n => n.status === 'pending' || n.status === 'read');
  const completedNotifications = filteredNotifications.filter(n => n.status === 'resolved' || n.status === 'dismissed');

  useEffect(() => { fetchNotifications(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="h-10 w-10 animate-spin text-indigo-600 mx-auto mb-4" />
        <p className="text-gray-700 dark:text-gray-300 font-medium">Fetching notifications...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 p-6">
      <div className="max-w-7xl mx-auto">

        {error && (
          <div className="bg-red-100 dark:bg-red-900 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            <p className="font-bold flex items-center gap-2"><XCircle className="w-5 h-5" /> Error</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* --- Notification Stats --- */} 
        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Notifications */}
          <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-100 to-indigo-200 dark:from-indigo-700 dark:to-indigo-800 rounded-xl shadow p-4">
            <p className="text-sm font-medium text-indigo-700 dark:text-indigo-200">Total</p>
            <p className="text-3xl font-extrabold text-indigo-900 dark:text-white">{totalCount}</p>
          </div>

        {/* Individual Status Cards */}
        {['pending', 'read', 'resolved', 'dismissed'].map((statusKey) => {
          const colors: Record<string, string> = {
            pending: "from-yellow-100 to-yellow-200 dark:from-yellow-700 dark:to-yellow-800 text-yellow-800 dark:text-yellow-100",
            read: "from-blue-100 to-blue-200 dark:from-blue-700 dark:to-blue-800 text-blue-800 dark:text-blue-100",
            resolved: "from-green-100 to-green-200 dark:from-green-700 dark:to-green-800 text-green-800 dark:text-green-100",
            dismissed: "from-red-100 to-red-200 dark:from-red-700 dark:to-red-800 text-red-800 dark:text-red-100",
          };

          return (
            <div
              key={statusKey}
              className={`flex flex-col items-center justify-center rounded-xl shadow p-4 bg-gradient-to-br ${colors[statusKey]}`}
            >
              <p className="text-sm font-medium">
                {statusKey.charAt(0).toUpperCase() + statusKey.slice(1)}
              </p>
              <p className="text-3xl font-extrabold">{statusCounts[statusKey] || 0}</p>
            </div>
          );
        })}
      </div>


        {/* Filters */}
        <div className="flex items-center gap-4 mb-6">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
          >
            <option value="all">All</option>
            <option value="pending">⏳ Pending</option>
            <option value="read">📖 Read</option>
            <option value="resolved">✅ Resolved</option>
            <option value="dismissed">❌ Dismissed</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
          >
            <option value="all">📅 All Dates</option>
            <option value="today">🌞 Today</option>
            <option value="yesterday">🌙 Yesterday</option>
            <option value="thisweek">📆 This Week</option>
            <option value="last7days">🗓 Last 7 Days</option>
            <option value="thismonth">📅 This Month</option>
            <option value="last30days">📊 Last 30 Days</option>
          </select>
          {/* Sort Dropdown */}
         
            <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Sort by:</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
              className="border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 shadow-sm"
            >
              <option value="newest">🆕 Newest → Oldest</option>
              <option value="oldest">📜 Oldest → Newest</option>
            </select>
     

        </div>

        {/* Active Notifications */}
        {activeNotifications.length > 0 ? (
          <TableSection 
            title="Active Notifications" 
            notifications={activeNotifications} 
            onStatusUpdate={handleStatusUpdate} 
            onDelete={handleDelete} 
          />
        ) : (
          <div className="text-center mb-8">
            <p className="text-gray-500 dark:text-gray-400">No active notifications.</p>
          </div>
        )}

        {/* Completed Notifications */}
        {completedNotifications.length > 0 && (
          <TableSection 
            title="Resolved / Dismissed Notifications" 
            notifications={completedNotifications} 
            onStatusUpdate={undefined} // Read-only
            onDelete={handleDelete} 
            readOnly
          />
        )}
      </div>
    </div>
  );
};

// Table Section

const TableSection: React.FC<TableSectionProps> = ({ title, notifications, onStatusUpdate, onDelete, readOnly }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
      <div className="p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-800">
        <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-1">
          <Bell className="w-4 h-4 text-indigo-600" /> {title}
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-xs">
          <thead className="bg-indigo-50 dark:bg-gray-700">
            <tr className="text-left font-medium text-gray-600 dark:text-gray-300 uppercase">
              <th className="px-2 py-2">👤 User</th>
               <th className="px-2 py-2 flex items-center gap-1">
                <AlertTriangle className="h-4 w-4 text-yellow-500" /> Emergency 
              </th>
              <th className="px-2 py-2">💬 Message</th>
              <th className="px-2 py-2 flex items-center gap-1">
                <MapPin className="h-4 w-4 text-red-500" /> Location
              </th>
              <th className="px-2 py-2">⚡ Urgency</th>
              <th className="px-2 py-2">📌 Status</th>
              <th className="px-2 py-2">⏰ Time</th>
              <th className="px-2 py-2">⚙️ Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map(notification => (
              <NotificationDetails
                key={notification.notificationId}
                notification={notification}
                onStatusUpdate={readOnly ? undefined : onStatusUpdate}
                readOnly={readOnly}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};


export default NotificationProps;
