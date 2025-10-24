import type { NotificationProp } from "@/features/personalization/types/notification-types";
import { mockProfiles } from "@/features/personalization/services/profile-services";

export const QUERIES = {
	fetchNotifications: async function (): Promise<NotificationProp[]> {
		await new Promise(resolve => setTimeout(resolve, 2000));
		let notifications: NotificationProp[] = mockNotifications;
		return notifications;
	},
};

export const MUTATIONS = {};

export const mockNotifications: NotificationProp[] = [
	{
		id: 1,
		author_id: 2,
		recipient_id: 1,
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "like",
		content: "liked your post",
		is_read: false,
		author: mockProfiles[1],
	},
	{
		id: 2,
		author_id: 3,
		recipient_id: 1,
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "comment",
		content: "commented on your post: \"Great work!\"",
		is_read: false,
		author: mockProfiles[2],
	},
	{
		id: 3,
		author_id: 4,
		recipient_id: 1,
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "follow",
		content: "started following you",
		is_read: false,
		author: mockProfiles[3],
	},
	{
		id: 4,
		author_id: 5,
		recipient_id: 1,
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "message",
		content: "sent you a message",
		is_read: false,
		author: mockProfiles[4],
	},
];