import React, { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';
import { ApiNotification, DisplayNotification } from '../interface/Notification';
import NotificationDetails from './NotificationDetails';
import Swal from 'sweetalert2';

// Main Component
const NotificationProps: React.FC = () => {
  const [notifications, setNotifications] = useState<DisplayNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const API_BASE_URL = 'http://localhost:3000/api/notifications';

  const convertApiNotification = (apiNotification: ApiNotification): DisplayNotification => {
    const getUrgency = (emergencyType: string): string => {
      const type = emergencyType.toLowerCase();
      if (type.includes('fire') || type.includes('medical') || type.includes('accident') || type.includes('crime') || type.includes('animal')) return 'high';
      if (type.includes('missing') || type.includes('hazardous') || type.includes('fall') || type.includes('power')) return 'medium';
      return 'low';
    };

    const formatTimestamp = (dateString: string): string => {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const minutes = Math.floor(diff / 60000);
      if (minutes < 1) return 'Just now';
      if (minutes < 60) return `${minutes}m ago`;
      if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return {
      notificationId: apiNotification.notification_id, 
      user: apiNotification.user.fullName,
      type: apiNotification.emergencyType.name,
      message: apiNotification.emergencyType.description,
      location: 'Emergency Location',
      urgency: getUrgency(apiNotification.emergencyType.name),
      status: apiNotification.status.name.toLowerCase(),
      timestamp: formatTimestamp(apiNotification.createdAt),
      userData: apiNotification.user,
      emergencyType: apiNotification.emergencyType
    };
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setNotifications(data.notifications.map(convertApiNotification));
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

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

        // Ask for resolution message if status requires it
        if (status.toLowerCase() === "resolved" || status.toLowerCase() === "dismissed") {
          const { value } = await Swal.fire({
            title: `Enter how this notification was ${status}`,
            input: "textarea",
            inputPlaceholder: "Type resolution details here...",
            inputAttributes: { "aria-label": "Resolution details", required: "true" },
            showCancelButton: true,
            confirmButtonText: "Submit",
            cancelButtonText: "Cancel",
            preConfirm: (value) => {
              if (!value) {
                Swal.showValidationMessage("Resolution details are required");
                return false;
              }
              return value;
            },
          });

          if (!value) return;
          resolutionMessage = value;
        }

        // 🔥 Single API call to update status + optional resolution message
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

        // Update local state
        setNotifications((prev) =>
          prev.map((n) =>
            n.notificationId === id
              ? {
                  ...n,
                  status,
                  resolutionMessage: resolutionMessage ?? n.resolutionMessage,
                }
              : n
          )
        );
      } catch (err) {
        console.error("Status update error:", err);
        setError(err instanceof Error ? err.message : "Status update failed");
      }
    };

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

  const getFilteredNotifications = () => {
    let filtered = notifications;
    if (filter !== 'all') filtered = filtered.filter(n => n.status === filter);

    if (dateFilter !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter(n => {
        const notificationDate = parseTimestampToDate(n.timestamp);
        if (!notificationDate) return false;
        const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());

        switch (dateFilter) {
          case 'today': return notificationDay.getTime() === today.getTime();
          case 'yesterday':
            const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
            return notificationDay.getTime() === yesterday.getTime();
          case 'last7days':
            const sevenDaysAgo = new Date(today); sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            return notificationDate >= sevenDaysAgo;
          case 'last30days':
            const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            return notificationDate >= thirtyDaysAgo;
          case 'thisweek':
            const startOfWeek = new Date(today); startOfWeek.setDate(today.getDate() - today.getDay());
            return notificationDate >= startOfWeek;
          case 'thismonth':
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            return notificationDate >= startOfMonth;
          default: return true;
        }
      });
    }

    return filtered;
  };

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

  const filteredNotifications = getFilteredNotifications();
  useEffect(() => { fetchNotifications(); }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
        <p className="text-gray-600 dark:text-gray-300">Loading notifications...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {error && (
          <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-6">
            <p className="font-medium">Error</p><p className="text-sm">{error}</p>
          </div>
        )}
        {/* Summary & Filters ... same as before ... */}

        {filteredNotifications.length > 0 ? (
          <TableSection 
            title={getTableTitle()} 
            notifications={filteredNotifications} 
            onStatusUpdate={handleStatusUpdate} 
            onDelete={handleDelete} 
          />
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No notifications found for the selected filters.</p>
          </div>
        )}
      </div>
    </div>
  );

  function getTableTitle(): string {
    const statusText = filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1);
    const dateText = dateFilter === 'all' ? '' : ` - ${getDateFilterText()}`;
    return `${statusText} Notifications${dateText}`;
  }

  function getDateFilterText(): string {
    switch (dateFilter) {
      case 'today': return 'Today';
      case 'yesterday': return 'Yesterday';
      case 'thisweek': return 'This Week';
      case 'last7days': return 'Last 7 Days';
      case 'thismonth': return 'This Month';
      case 'last30days': return 'Last 30 Days';
      default: return '';
    }
  }
};

// Table Section Component
interface TableSectionProps {
  title: string;
  notifications: DisplayNotification[];
  onStatusUpdate: (id: number, status: string) => void;
  onDelete: (id: number) => void;
}

const TableSection: React.FC<TableSectionProps> = ({ title, notifications, onStatusUpdate, onDelete }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th>User & Type</th>
              <th>Message</th>
              <th>Location</th>
              <th>Urgency</th>
              <th>Status</th>
              <th>Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {notifications.map(notification => (
              <NotificationDetails 
                key={notification.notificationId} 
                notification={notification} 
                onStatusUpdate={onStatusUpdate} 
                
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NotificationProps;
