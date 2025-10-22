import { Heart, MessageCircle, Share, UserPlus } from "lucide-react";

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
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "like",
		content: "liked your post",
		is_read: false,
		author: mockProfiles[1],
	},
	{
		id: 2,
		author_id: 3,
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "comment",
		content: "commented on your post: \"Great work!\"",
		is_read: false,
		author: mockProfiles[2],
	},
	{
		id: 3,
		author_id: 4,
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "follow",
		content: "started following you",
		is_read: false,
		author: mockProfiles[3],
	},
	{
		id: 4,
		author_id: 5,
		created_at: "2025-10-20 16:48:11.644153+00",
		type: "message",
		content: "sent you a message",
		is_read: false,
		author: mockProfiles[4],
	},
];

export const fakeNotifs = [
	{
		id: 1,
		type: "like",
		actor: { name: "Sarah Johnson", username: "sarah_tech", avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b789?w=150&h=150&fit=crop&crop=face" },
		content: "liked your post",
		time: "2m",
		read: false,
		icon: Heart,
		iconColor: "text-destructive",
	},
	{
		id: 2,
		type: "comment",
		actor: { name: "Alex Chen", username: "alex_design", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" },
		content: "commented on your post: \"Great work!\"",
		time: "5m",
		read: false,
		icon: UserPlus,
		iconColor: "text-accent-foreground",
	},
	{
		id: 3,
		type: "follow",
		actor: { name: "Maya Patel", username: "maya_dev", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face" },
		content: "started following you",
		time: "1h",
		read: true,
		icon: MessageCircle,
		iconColor: "text-primary",
	},
	{
		id: 4,
		type: "message",
		actor: { name: "David Kim", username: "david_photo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" },
		content: "sent you a message",
		time: "2h",
		read: true,
		icon: Share,
		iconColor: "text-primary",
	},
];