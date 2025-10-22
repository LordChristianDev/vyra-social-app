import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";

// -- Extract YouTube Video ID
export const extractYouTubeId = (content: string) => {
	if (!content) return null;

	const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
	const match = content.match(pattern);

	return match ? match[1] : null;
};

// -- Return notification icon based on type
export const getNotificationIcon = (type: string) => {
	switch (type) {
		case "like":
			return <Heart className="h-4 w-4 text-red-500" />;
		case "comment":
			return <MessageCircle className="h-4 w-4 text-blue-500" />;
		case "follow":
			return <UserPlus className="h-4 w-4 text-green-500" />;
		case "message":
			return <MessageCircle className="h-4 w-4 text-primary" />;
		default:
			return <Bell className="h-4 w-4" />;
	}
};