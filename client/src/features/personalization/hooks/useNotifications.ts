import type { NotificationProp } from "../types/notification-types";

export const useNotifications = () => {
	const unread = (notifications: NotificationProp[]): number => {
		return notifications.filter(notif => !notif.is_read).length;
	}

	return { unread };
};