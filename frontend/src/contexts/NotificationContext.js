import axios from "axios";
import {
  createContext,
  memo,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// context data for presenter of the notifications (snackbars, whatevere ...)
const defaultNotificationPresenterData = {
  notifications: [],
  removeNotification: () => {},
};

// context data for suppliers of the notifications (any component raising notifications)
const defaultNotificationSupplierData = {
  addNotification: () => {},
};

// Context for the presenter of the notifications
export const NotificationPresenterContext = createContext(
  defaultNotificationPresenterData
);

// Context for the supplier of the notifications
export const NotificationSupplierContext = createContext(
  defaultNotificationSupplierData
);

// Supplier context provider, allow to add notifications
const NotificationSupplierContextProviderInternal = ({
  children,
  addNotification,
}) => {
  const contextValue = {
    addNotification,
  };

  return (
    <NotificationSupplierContext.Provider value={contextValue}>
      {children}
    </NotificationSupplierContext.Provider>
  );
};

// have a memoized context provider, so that it doesn't rerender without props change
const NotificationSupplierContextProvider = memo(
  NotificationSupplierContextProviderInternal
);

// A provider context, which is used as the main entry point, providing and displaying notifications
export const NotificationContext = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback(() => {
    let removedNotification = null;
    let newNotifications = null;
    setNotifications((notifications) => {
      // pop out the first notification
      const [toBeRemovedNotification, ...toBeNewNotifications] = notifications;
      removedNotification = toBeRemovedNotification;
      newNotifications = toBeNewNotifications;
      return toBeNewNotifications;
    });
    return { removedNotification, newNotifications };
  }, [setNotifications]);

  const addNotification = useCallback(
    (notification) => {
      // add a notification to the end
      setNotifications((notifications) => [...notifications, notification]);
    },
    [setNotifications]
  );

  // register an interceptor for axios errors:
  useEffect(() => {
    const responseInterceptor = axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        const { message } = error.response.data;
        if (message) {
          addNotification({
            severity: "error",
            message,
          });
        } else {
          addNotification({
            severity: "error",
            message: JSON.stringify(error.response.data),
          });
        }
        return error;
      }
    );

    return function cleanup() {
      axios.interceptors.response.eject(responseInterceptor);
    };
  });

  const contextValue = {
    notifications,
    removeNotification,
  };

  return (
    <NotificationPresenterContext.Provider value={contextValue}>
      <NotificationSupplierContextProvider addNotification={addNotification}>
        {children}
      </NotificationSupplierContextProvider>
    </NotificationPresenterContext.Provider>
  );
};

export const useTriggerNotification = () => {
  return useContext(NotificationSupplierContext);
};

export const useShowNotifications = () => {
  return useContext(NotificationPresenterContext);
};
