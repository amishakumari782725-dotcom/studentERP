import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addNotification = useCallback(
    ({ type = 'info', title, message, duration = 4000 }) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newNotification = { id, type, title, message };

      setNotifications((prev) => [...prev, newNotification]);

      if (duration > 0) {
        setTimeout(() => {
          removeNotification(id);
        }, duration);
      }
    },
    [removeNotification]
  );

  const notifySuccess = useCallback(
    (message, title = 'Success') => addNotification({ type: 'success', title, message }),
    [addNotification]
  );

  const notifyError = useCallback(
    (message, title = 'Error') => addNotification({ type: 'error', title, message: message || 'An unexpected error occurred.' }),
    [addNotification]
  );

  const notifyWarning = useCallback(
    (message, title = 'Warning') => addNotification({ type: 'warning', title, message }),
    [addNotification]
  );

  const notifyInfo = useCallback(
    (message, title = 'Information') => addNotification({ type: 'info', title, message }),
    [addNotification]
  );

  return (
    <NotificationContext.Provider
      value={{
        addNotification,
        notifySuccess,
        notifyError,
        notifyWarning,
        notifyInfo,
      }}
    >
      {children}
      {/* Toast container positioned top-right */}
      <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => {
          let borderClass = 'border-[#E2E8F0]';
          let icon = <Info className="w-5 h-5 text-[#7A1528] flex-shrink-0" />;

          if (n.type === 'success') {
            borderClass = 'border-emerald-200 bg-white';
            icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />;
          } else if (n.type === 'error') {
            borderClass = 'border-rose-200 bg-white';
            icon = <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />;
          } else if (n.type === 'warning') {
            borderClass = 'border-amber-200 bg-white';
            icon = <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />;
          } else if (n.type === 'info') {
            borderClass = 'border-[#E2E8F0] bg-white';
            icon = <Info className="w-5 h-5 text-[#7A1528] flex-shrink-0" />;
          }

          return (
            <div
              key={n.id}
              className={`pointer-events-auto p-4 rounded-md border shadow-sm flex items-start space-x-3 bg-white transition-all duration-150 ${borderClass}`}
              role="alert"
            >
              <div className="mt-0.5">{icon}</div>
              <div className="flex-1 min-w-0">
                {n.title && <p className="text-xs font-semibold text-[#0F172A]">{n.title}</p>}
                <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">{n.message}</p>
              </div>
              <button
                type="button"
                onClick={() => removeNotification(n.id)}
                className="text-[#94A3B8] hover:text-[#475569] transition-colors"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
