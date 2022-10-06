import { Alert, Snackbar } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { useShowNotifications } from "./NotificationContext";

const Notifications = () => {
  const { notifications, removeNotification } = useShowNotifications();
  // here will be stored an object looking like this:
  // {
  //     // see https://mui.com/material-ui/react-alert/#basic-alerts
  //     severity: '',
  //     message: '',
  //   }

  const [notification, setNotification] = useState(null);

  const showNextNotification = useCallback(() => {
    if (notifications.length) {
      const [firstNotification] = notifications;
      if (firstNotification.severity) {
        setNotification({
          severity: firstNotification.severity,
          message: firstNotification.message,
        });
      } else {
        setNotification({
          severity: "warning",
          message: JSON.stringify(firstNotification),
        });
      }
    } else {
      setNotification(null);
    }
  }, [notifications]);

  useEffect(() => {
    showNextNotification();
  }, [showNextNotification]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    // this way the notification is first closed, but then the next one appears if there is still some notification in the stack
    setNotification(null);
    removeNotification();
  };

  return (
    <Snackbar
      open={notification !== null}
      autoHideDuration={10000}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      onClose={handleClose}
    >
      {notification !== null ? (
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          sx={{ width: "100%", maxHeight: "200px", textOverflow: "ellipsis" }}
        >
          {notification.message}
        </Alert>
      ) : null}
    </Snackbar>
  );
};

export default Notifications;
