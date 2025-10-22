import { useQuery } from "@tanstack/react-query";

import { NotificationsOverview } from "@/features/personalization/components/notifications/notifications-overview";

import { QUERIES } from "@/features/personalization/services/notification-services";

export default function NotificationsPage() {
	return (
		<NotificationsContent />
	);
};

const NotificationsContent = () => {
	const { data: notificationsData, isFetching: notificationsFetching } = useQuery({
		queryKey: ["appbar-notifications"],
		queryFn: async () => QUERIES.fetchNotifications(),
		refetchOnMount: true,
		enabled: true,
		staleTime: 0,
	});

	return (
		<main className="p-8 mx-auto w-full">
			{notificationsFetching ? (
				<div className="animate-pulse space-y-4">
					<div className="h-12 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
				</div>
			) : (
				<NotificationsOverview
					all_notifications={notificationsData ?? []}
				/>
			)}
		</main>
	);
};