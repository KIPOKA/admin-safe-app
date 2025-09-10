import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, Eye, XCircle, User, MessageSquare, AlertTriangle, X, RefreshCw } from 'lucide-react';
import { ApiNotification, DisplayNotification } from '../interface/Notification';


// Badge components (unchanged)
const UrgencyBadge: React.FC<{ urgency: string }> = ({ urgency }) => {
  const getUrgencyStyle = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200 dark:border-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200 dark:border-green-700';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600';
    }
  };
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyStyle(urgency)}`}>
      {urgency.toUpperCase()}
    </span>
  );
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
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
const ActionButton: React.FC<{
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

const NotificationDeatils: React.FC<{
  notification: DisplayNotification;
  onStatusUpdate?: (id: number, status: string) => void; 
  readOnly?: boolean; // add this
}> = ({ notification, onStatusUpdate, readOnly = false }) => { 

  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(notification.status);

  const getUrgencyColors = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return { bg: 'bg-red-50 dark:bg-red-900', border: 'border-red-200 dark:border-red-700', headerBg: 'bg-red-600', icon: 'text-red-600 dark:text-red-400' };
      case 'medium':
        return { bg: 'bg-yellow-50 dark:bg-yellow-900', border: 'border-yellow-200 dark:border-yellow-700', headerBg: 'bg-yellow-600', icon: 'text-yellow-600 dark:text-yellow-400' };
      case 'low':
        return { bg: 'bg-green-50 dark:bg-green-900', border: 'border-green-200 dark:border-green-700', headerBg: 'bg-green-600', icon: 'text-green-600 dark:text-green-400' };
      default:
        return { bg: 'bg-blue-50 dark:bg-blue-900', border: 'border-blue-200 dark:border-blue-700', headerBg: 'bg-blue-600', icon: 'text-blue-600 dark:text-blue-400' };
    }
  };
  const urgencyColors = getUrgencyColors(notification.urgency);

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'emergency':
      case 'security_alert':
        return AlertTriangle;
      case 'maintenance':
      default:
        return MessageSquare;
    }
  };
  const TypeIcon = getTypeIcon(notification.type);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(event.target.value);
  };

  return (
    <>
      <tr className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="font-medium text-gray-900 dark:text-gray-100">{notification.user}</div>
          <div className="text-sm text-gray-500 dark:text-gray-300">{notification.type.replace('_', ' ')}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate">{notification.message}</div>
        </td>
            <div className="flex items-center space-x-3">
              <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${urgencyColors.icon} bg-white dark:bg-gray-700 rounded-lg shadow-sm`}>
                  <MapPin className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-sm text-gray-500 dark:text-gray-300">
                  <p className="font-medium">Location</p>
                  <div className="flex items-center"> 
                    {notification.location?.city || 'Unknown City'}, {notification.location?.country || 'Unknown Country'}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-400 truncate">
                    Lat: {notification.location?.latitude ?? 'N/A'}, Lng: {notification.location?.longitude ?? 'N/A'}
                  </div>
                  {notification.location?.description && (
                    <p className="text-xs italic mt-1">{notification.location.description}</p>
                  )}
                </div>
              </div>
            </td> 
             </div>

        <td className="px-6 py-4 whitespace-nowrap">
          <UrgencyBadge urgency={notification.urgency} />
        </td>
       <td className="px-6 py-4 whitespace-nowrap">
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
             onStatusUpdate?.(notification.notificationId, selectedStatus);

            }}
            className="border border-gray-300 rounded-md p-1 text-sm"
          >
            <option value="resolved">Resolved</option>
            <option value="pending">Pending</option>
            <option value="dismissed">Dismissed</option>
            <option value="read">Read</option>
          </select>
        </td>

        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {notification.timestamp}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <ActionButton icon={CheckCircle} onClick={() => setShowModal(true)} color="green" tooltip="Edit Status" />
            <ActionButton icon={Eye} onClick={() => setShowModal(true)} color="blue" tooltip="View details" />
              <ActionButton
              icon={XCircle}
              onClick={() => !readOnly && onStatusUpdate?.(notification.notificationId, 'dismissed')}
              color="red"
              tooltip="delete"
            />

            </div>
        </td>
      </tr>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-2xl transform transition-all duration-300 scale-100 ${urgencyColors.border} border-2 overflow-hidden`}>
            
            {/* Header */}
            <div className={`${urgencyColors.headerBg} px-6 py-4 text-white relative`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-lg">
                    <TypeIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Notification Details</h3>
                    <p className="text-sm opacity-90">{notification.type.replace('_', ' ').toUpperCase()}</p>
                  </div>
                </div>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200">
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className={`${urgencyColors.bg} dark:bg-opacity-90 p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white dark:bg-gray-700 rounded-lg shadow-sm`}>
                      <User  className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">User </p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{notification.user}</p>
                      {notification.userData?.allergies && (
                        <p className="text-sm text-red-600 dark:text-red-400 font-medium mt-1">⚠️ Allergies: {notification.userData.allergies}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white dark:bg-gray-700 rounded-lg shadow-sm`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col text-sm text-gray-500 dark:text-gray-300">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {notification.location?.city || 'Unknown City'}, {notification.location?.country || 'Unknown Country'}
                          </div>
                          <div className="text-xs text-gray-400 dark:text-gray-400 truncate">
                            Lat: {notification.location?.latitude}, Lng: {notification.location?.longitude}
                          </div>
                        </div>

                  </div>

                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white dark:bg-gray-700 rounded-lg shadow-sm`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">Timestamp</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white dark:bg-gray-700 rounded-lg shadow-sm`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">Urgency</p>
                      <div className="mt-1"><UrgencyBadge urgency={notification.urgency} /></div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white dark:bg-gray-700 rounded-lg shadow-sm`}>
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">Status</p>
                      <div className="mt-1">
                        <select value={selectedStatus} onChange={handleStatusChange} className="border border-gray-300 rounded-md p-2">
                          <option value="resolved">Resolved</option>
                          <option value="pending">Pending</option>
                          <option value="dismissed">Dismissed</option>
                          {/* Add more statuses as needed */}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Blood Type Display */}
                  {notification.userData?.bloodType && (
                    <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border-l-4 border-red-500">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Blood Type</p>
                      <p className="text-lg font-bold text-red-600 dark:text-red-400">{notification.userData.bloodType.type}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Emergency Contacts */}
              {notification.userData?.emergencyContacts && notification.userData.emergencyContacts.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Emergency Contacts</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {notification.userData.emergencyContacts.map((contact) => (
                      <div key={contact.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                        <p className="font-medium text-gray-900 dark:text-gray-100">{contact.name}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{contact.relation}</p>
                        <p className="text-sm font-mono text-blue-600 dark:text-blue-400">{contact.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Medical Aid */}
              {notification.userData?.medicalAid && (
                <div className="mt-4">
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Medical Aid</h4>
                  <div className="bg-white dark:bg-gray-700 p-3 rounded-lg border border-gray-200 dark:border-gray-600">
                    <p className="font-medium text-gray-900 dark:text-gray-100">{notification.userData.medicalAid.name}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{notification.userData.medicalAid.type}</p>
                  </div>
                </div>
              )}

              {/* Message */}
              <div className="mt-6">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 ${urgencyColors.icon} bg-white dark:bg-gray-700 rounded-lg shadow-sm flex-shrink-0`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide mb-2">Message</p>
                    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{notification.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
              <button onClick={() => setShowModal(false)} className="px-6 py-2 bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-600 transition-colors duration-200 font-medium">
                Close
              </button>
              <button onClick={() => { onStatusUpdate?.(notification.notificationId, selectedStatus);setShowModal(false); }} className={`px-6 py-2 ${urgencyColors.headerBg} text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium flex items-center space-x-2`}>
                <CheckCircle className="h-4 w-4" /><span>Update Status</span>
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default  NotificationDeatils;