import type { LucideIcon } from "lucide-react";

export type NotificationProp = {
	id: number,
	type: string,
	content: string,
	time: string,
	read: boolean,
	icon: LucideIcon,
	iconColor: string,
	actor: ActorProp,
};

export type ActorProp = {
	name: string,
	username: string,
	avatar: string,
};