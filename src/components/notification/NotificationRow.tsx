import React, { useState } from 'react';
import { MapPin, Clock, CheckCircle, Eye, XCircle, User, MessageSquare, AlertTriangle, X } from 'lucide-react';
import { Notification } from '../interface/Notification';
import { UrgencyBadge } from '../status/UrgencyBadge';
import { StatusBadge } from '../status/StatusBadge';
import { ActionButton } from '../button/ActionButton';

interface NotificationRowProps {
  notification: Notification;
  onStatusUpdate: (id: number, status: string) => void;
}

export const NotificationRow: React.FC<NotificationRowProps> = ({ 
  notification, 
  onStatusUpdate 
}) => {
  const [showModal, setShowModal] = useState(false);

  // Get urgency color scheme
  const getUrgencyColors = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case 'high':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          headerBg: 'bg-red-600',
          icon: 'text-red-600'
        };
      case 'medium':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          headerBg: 'bg-yellow-600',
          icon: 'text-yellow-600'
        };
      case 'low':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          headerBg: 'bg-green-600',
          icon: 'text-green-600'
        };
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          headerBg: 'bg-blue-600',
          icon: 'text-blue-600'
        };
    }
  };

  const urgencyColors = getUrgencyColors(notification.urgency);

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'emergency':
        return AlertTriangle;
      case 'security_alert':
        return AlertTriangle;
      case 'maintenance':
        return MessageSquare;
      default:
        return MessageSquare;
    }
  };

  const TypeIcon = getTypeIcon(notification.type);

  return (
    <>
      <tr className="hover:bg-gray-50 transition-colors duration-150">
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="font-medium text-gray-900">{notification.user}</div>
          <div className="text-sm text-gray-500">{notification.type.replace('_', ' ')}</div>
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-gray-900 max-w-xs truncate">{notification.message}</div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center text-sm text-gray-500">
            <MapPin className="h-4 w-4 mr-1" />
            {notification.location}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <UrgencyBadge urgency={notification.urgency} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <StatusBadge status={notification.status} />
        </td>
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {notification.timestamp}
          </div>
        </td>
        <td className="px-6 py-4 whitespace-nowrap">
          <div className="flex items-center space-x-2">
            <ActionButton
              icon={CheckCircle}
              onClick={() => onStatusUpdate(notification.id, 'resolved')}
              color="green"
              tooltip="Mark as resolved"
            />
            <ActionButton
              icon={Eye}
              onClick={() => setShowModal(true)}
              color="blue"
              tooltip="View details"
            />
            <ActionButton
              icon={XCircle}
              onClick={() => onStatusUpdate(notification.id, 'dismissed')}
              color="red"
              tooltip="Dismiss"
            />
          </div>
        </td>
      </tr>

      {/* Enhanced Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn">
          <div className={`bg-white rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 xl:w-2/5 max-w-2xl transform transition-all duration-300 scale-100 ${urgencyColors.border} border-2 overflow-hidden`}>
            
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
                <button 
                  onClick={() => setShowModal(false)} 
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors duration-200"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className={`${urgencyColors.bg} p-6`}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* User Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white rounded-lg shadow-sm`}>
                      <User className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">User</p>
                      <p className="text-lg font-semibold text-gray-900">{notification.user}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white rounded-lg shadow-sm`}>
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Location</p>
                      <p className="text-lg font-semibold text-gray-900">{notification.location}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white rounded-lg shadow-sm`}>
                      <Clock className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Timestamp</p>
                      <p className="text-lg font-semibold text-gray-900">{notification.timestamp}</p>
                    </div>
                  </div>
                </div>

                {/* Status Info */}
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white rounded-lg shadow-sm`}>
                      <AlertTriangle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Urgency</p>
                      <div className="mt-1">
                        <UrgencyBadge urgency={notification.urgency} />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className={`p-2 ${urgencyColors.icon} bg-white rounded-lg shadow-sm`}>
                      <CheckCircle className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">Status</p>
                      <div className="mt-1">
                        <StatusBadge status={notification.status} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div className="mt-6">
                <div className="flex items-start space-x-3">
                  <div className={`p-2 ${urgencyColors.icon} bg-white rounded-lg shadow-sm flex-shrink-0`}>
                    <MessageSquare className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">Message</p>
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                      <p className="text-gray-900 leading-relaxed">{notification.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onStatusUpdate(notification.id, 'resolved');
                    setShowModal(false);
                  }}
                  className={`px-6 py-2 ${urgencyColors.headerBg} text-white rounded-lg hover:opacity-90 transition-opacity duration-200 font-medium flex items-center space-x-2`}
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Mark Resolved</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      
    </>
  );
};