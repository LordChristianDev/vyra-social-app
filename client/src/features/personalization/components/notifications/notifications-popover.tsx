import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, Heart, MessageCircle, UserPlus } from "lucide-react";

import { useRoutes } from "@/hooks/use-routes";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { NotificationProp } from "@/features/personalization/types/notification-types";
import { QUERIES } from "@/features/personalization/services/notification-services";

const getNotificationIcon = (type: string) => {
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

export const NotificationsPopover = () => {
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<NotificationProp[]>([]);
	const { move } = useRoutes();

	const { data, isFetching } = useQuery({
		queryKey: ["user-notifications"],
		queryFn: async () => QUERIES.fetchNotifications(),
		enabled: true,
		staleTime: 0,
	});

	useEffect(() => {
		if (data && !isFetching) {
			setNotifications(data);
		}
	}, [data, isFetching]);

	const markAllAsRead = () => {
		setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
	};

	const unreadCount = notifications.filter(notif => !notif.read).length;

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (open) {
			markAllAsRead();
		}
	};

	const renderNotifications = notifications.map((notification, index) => {
		const { id, type, actor, content, time, read } = notification;

		const renderActor = actor.name.split(" ").map(n => n[0]).join("");

		return (
			<div key={id}>
				<div className={`p-3 hover:bg-accent/50 cursor-pointer transition-smooth ${!read ? 'bg-accent/20' : ''
					}`}>
					<div className="flex gap-3">
						<AvatarIcon
							src={actor.avatar}
							fallback={renderActor}
							size="sm"
						/>

						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								{getNotificationIcon(type)}
								<span className="text-sm font-medium truncate">
									{actor.name}
								</span>
								<span className="text-xs text-muted-foreground">
									{time}
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								{content}
							</p>
						</div>
						{!read && (
							<div className="h-2 w-2 bg-primary rounded-full mt-1" />
						)}
					</div>
				</div>
				{index < notifications.length - 1 && <Separator />}
			</div>
		);
	})

	return (
		<Popover open={isOpen} onOpenChange={handleOpenChange}>
			<PopoverTrigger asChild>
				<Button variant="ghost" size="icon" className="relative cursor-pointer">
					<Bell className="h-5 w-5" />
					{unreadCount > 0 && (
						<Badge className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gradient-primary text-primary-foreground">
							{unreadCount > 9 ? '9+' : unreadCount}
						</Badge>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="end">
				<div className="p-4 border-b">
					<div className="flex items-center justify-between">
						<h3 className="font-semibold">Notifications</h3>
						{unreadCount > 0 && (
							<Button variant="ghost" size="sm" onClick={markAllAsRead}>
								Mark all read
							</Button>
						)}
					</div>
				</div>

				<ScrollArea className="h-80">
					<div className="space-y-1">
						{renderNotifications}
					</div>
				</ScrollArea>

				<div className="p-3 border-t">
					<Button
						variant="ghost"
						className="w-full text-sm"
						onClick={() => move("/notifications")}
					>
						View all notifications
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	);
};