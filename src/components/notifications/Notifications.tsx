import React from 'react';
import { Bell } from 'lucide-react';

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  read: boolean;
}

export const Notifications: React.FC = () => {
  const [notifications, setNotifications] = React.useState<Notification[]>([]);

  React.useEffect(() => {
    // TODO: Fetch notifications from API
  }, []);

  const markAsRead = async (id: number) => {
    // TODO: Implement mark as read
  };

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:px-6 border-b flex justify-between items-center">
        <div className="flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          <h3 className="text-lg font-medium text-gray-900">Notifications</h3>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {notifications.filter(n => !n.read).length} New
        </span>
      </div>

      <div className="divide-y divide-gray-200">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-4 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                <p className="mt-1 text-sm text-gray-500">{notification.message}</p>
                <p className="mt-1 text-xs text-gray-400">
                  {new Date(notification.timestamp).toLocaleString()}
                </p>
              </div>
              {!notification.read && (
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-4 text-center text-gray-500">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
};