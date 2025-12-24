// Global state for controlling toast notifications
class NotificationState {
  enabled = $state(true);
}

export const notificationState = new NotificationState();
