import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell } from "lucide-react";

import { useAuth } from "@/context/use-auth";
import { useRoutes } from "@/hooks/use-routes";
import { useNotifications } from "@/features/personalization/hooks/useNotifications";
import { getNotificationIcon } from "@/lib/helpers";
import { createFullName, getInitials, timeAgo } from "@/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

import type { NotificationProp } from "@/features/personalization/types/notification-types";
import {
	CONTROLLER as NOTIFICATION_CONTROLLER
} from "@/features/personalization/services/notification-services";

export const NotificationsPopover = () => {
	const { currentUser } = useAuth();
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const [notifications, setNotifications] = useState<NotificationProp[]>([]);

	const { move } = useRoutes();
	const { unread } = useNotifications();

	const { data, isFetching } = useQuery({
		queryKey: ["notification-popover-notifications"],
		queryFn: async () => NOTIFICATION_CONTROLLER.FetchAllNotificationsWithUserId(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	useEffect(() => {
		if (data && !isFetching) {
			const result = data.filter(n => !n.is_read);
			setNotifications(result);
		}
	}, [data, isFetching]);

	const markAllAsRead = () => {
		setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
	};

	const unreadCount = unread(notifications);

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		if (open) {
			markAllAsRead();
		}
	};

	const renderNotifications = notifications.map((notification, index) => {
		const { id, created_at, type, content, is_read,
			author: { first_name, last_name, avatar_url }
		} = notification;

		const fullname = createFullName(first_name, last_name)

		return (
			<div key={id}>
				<div className={`p-3 hover:bg-accent/50 cursor-pointer transition-smooth ${!is_read ? 'bg-accent/20' : ''
					}`}>
					<div className="flex gap-3">
						<AvatarIcon
							src={avatar_url ?? ""}
							fallback={getInitials(fullname)}
							size="sm"
						/>

						<div className="flex-1 min-w-0">
							<div className="flex items-center gap-2 mb-1">
								{getNotificationIcon(type)}
								<span className="text-sm font-medium truncate">
									{first_name}
								</span>
								<span className="text-xs text-muted-foreground">
									{timeAgo(created_at)}
								</span>
							</div>
							<p className="text-sm text-muted-foreground">
								{content}
							</p>
						</div>
						{!is_read && (
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
						<Badge className="absolute -top-1 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-gradient-primary text-white">
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

				<ScrollArea className="flex h-60">
					{notifications && notifications.length > 0 ? (
						<div className="space-y-1">
							{renderNotifications}
						</div>
					) : (
						<div className="mx-auto my-auto py-4 flex flex-col justify-center items-center h-60">
							<h2 className="text-2xl font-semibold ">No Notifications</h2>
							<p className="text-sm text-muted-foreground">Try checking again later</p>
						</div>
					)}

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