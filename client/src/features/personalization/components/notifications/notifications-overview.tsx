import { useEffect, useEffectEvent, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Heart } from "lucide-react";

import { useNotifications } from "@/features/personalization/hooks/useNotifications";
import { getNotificationIcon } from "@/lib/helpers";
import { createFullName, getInitials, timeAgo } from "@/lib/formatters";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import {
	Tabs,
	TabsContent,
	TabsList,
	TabsTrigger
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { NotificationProp } from "@/features/personalization/types/notification-types";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/notification-services";

export const NotificationsOverview = ({ all_notifications }: { all_notifications: NotificationProp[] }) => {
	const queryClient = useQueryClient();
	const [activeTab, setActiveTab] = useState<string>("all");
	const [notifications, setNotifications] = useState<NotificationProp[]>(all_notifications);
	const { unread } = useNotifications();

	const onUpdate = useEffectEvent(() => {
		setNotifications([]);
		if (activeTab === "unread") {
			setNotifications(all_notifications.filter((n: NotificationProp) => !n.is_read));
		} else {
			setNotifications(all_notifications)
		}
	});

	const unreadCount = unread(notifications);

	useEffect(() => {
		onUpdate();
	}, [activeTab, all_notifications]);

	const markAsRead = async (id: number) => {
		setNotifications(prev => prev.map(notif =>
			notif.id === id ? { ...notif, is_read: true } : notif
		));

		const status = await PROFILE_CONTROLLER.UpdateNotification(id);

		if (status) {
			queryClient.invalidateQueries({ queryKey: ["notification-popover-notifications"] });
		}

	};

	const renderNotifications = notifications.map((n: NotificationProp) => {
		const { id, created_at, type, content, is_read,
			author: { first_name, last_name, avatar_url }
		} = n;

		const fullName = createFullName(first_name, last_name);

		return (
			<div
				key={id}
				onClick={() => markAsRead(id)}
				className={`flex items-center gap-4 p-4 rounded-lg cursor-pointer transition-smooth border ${!is_read
					? "bg-gradient-primary/5 border-primary/20 hover:bg-gradient-primary/10"
					: "hover:bg-accent/50 border-transparent"
					}`
				}
			>
				<div className="relative">
					<AvatarIcon
						src={avatar_url ?? ""}
						fallback={getInitials(fullName)}
					/>

					<div className={"absolute -bottom-1 -right-1 p-1 rounded-full bg-background"}>
						{getNotificationIcon(type)}
					</div>
				</div>

				<div className="flex-1">
					<p className="text-sm">
						<span className="font-medium">{fullName}</span>
						{" "}
						<span className="text-muted-foreground">{content}</span>
					</p>

					<p className="text-xs text-muted-foreground mt-1">
						{timeAgo(created_at)}
					</p>
				</div>

				{!is_read && (
					<div className="w-2 h-2 rounded-full bg-gradient-primary"></div>
				)}
			</div >
		);
	});

	return (

		<Card className="shadow-soft">
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					Notifications
					{unreadCount > 0 && (
						<Badge className="bg-gradient-primary text-primary-foreground">
							{unreadCount}
						</Badge>
					)}
				</CardTitle>
			</CardHeader>

			<CardContent>
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-2 mb-6">
						<TabsTrigger value="all" className="cursor-pointer">
							All
						</TabsTrigger>

						<TabsTrigger value="unread" className="cursor-pointer">
							Unread ({unreadCount})
						</TabsTrigger>
					</TabsList>

					<TabsContent value={activeTab}>
						<div className="space-y-4">
							{renderNotifications}

							{notifications.length === 0 && (
								<div className="text-center py-12">
									<div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-secondary flex items-center justify-center">
										<Heart className="h-8 w-8 text-primary" />
									</div>

									<p className="text-muted-foreground">No notifications to show</p>
								</div>
							)}
						</div>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>

	);
};