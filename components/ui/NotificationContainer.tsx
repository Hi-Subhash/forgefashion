
import React from 'react';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationIcon: React.FC<{ type: 'success' | 'error' | 'info' }> = ({ type }) => {
    const icons = {
        success: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        error: (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
        info: (
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        ),
    };
    return icons[type];
}

const Notification: React.FC<{ notification: any, onRemove: (id: number) => void }> = ({ notification, onRemove }) => {
    const [isExiting, setIsExiting] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            const removeTimer = setTimeout(() => onRemove(notification.id), 300);
            return () => clearTimeout(removeTimer);
        }, 4700);

        return () => clearTimeout(timer);
    }, [notification.id, onRemove]);

    const handleRemove = () => {
        setIsExiting(true);
        setTimeout(() => onRemove(notification.id), 300);
    };

    const baseClasses = 'w-full max-w-sm bg-gray-800/80 backdrop-blur-lg border border-white/20 shadow-2xl rounded-lg pointer-events-auto ring-1 ring-black ring-opacity-5 overflow-hidden transition-all duration-300 ease-in-out';
    const animationClasses = isExiting ? 'animate-fade-out-right' : 'animate-fade-in-right';
    
    const typeClasses = {
        success: 'border-green-500/50',
        error: 'border-red-500/50',
        info: 'border-blue-500/50'
    }[notification.type];

    return (
        <div className={`${baseClasses} ${animationClasses} ${typeClasses}`}>
            <div className="p-4">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <NotificationIcon type={notification.type} />
                    </div>
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-medium text-white">{notification.message}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex">
                        <button onClick={handleRemove} className="rounded-md inline-flex text-gray-400 hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white">
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <>
      <div className="fixed inset-0 flex items-end px-4 py-6 pointer-events-none sm:p-6 sm:items-start z-[100]">
        <div className="w-full flex flex-col items-center space-y-4 sm:items-end">
          {notifications.map((notification) => (
            <Notification key={notification.id} notification={notification} onRemove={removeNotification} />
          ))}
        </div>
      </div>
      <style>{`
          @keyframes fadeInRight {
            from {
              opacity: 0;
              transform: translate3d(100%, 0, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
          .animate-fade-in-right {
            animation: fadeInRight 0.3s ease-out forwards;
          }
          @keyframes fadeOutRight {
            from {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
            to {
              opacity: 0;
              transform: translate3d(100%, 0, 0);
            }
          }
          .animate-fade-out-right {
            animation: fadeOutRight 0.3s ease-in forwards;
          }
        `}</style>
    </>
  );
};

export default NotificationContainer;
