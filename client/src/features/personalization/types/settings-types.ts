export type NotificationSettingsProp = {
	id: number;
	user_id: number;

	notify_likes: boolean;
	notify_comments: boolean;
	notify_follows: boolean;
	notify_messages: boolean;
};

export type PrivacySettingsProp = {
	id: number;
	user_id: number;

	is_verified: boolean;
	is_public: boolean;
	show_active: boolean;
};