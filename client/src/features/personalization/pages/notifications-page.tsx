import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";

import { NotificationsOverview } from "@/features/personalization/components/notifications/notifications-overview";

import { CONTROLLER as NOTIFICATION_CONTROLLER } from "@/features/personalization/services/notification-services";

export default function NotificationsPage() {
	return (
		<NotificationsContent />
	);
};

const NotificationsContent = () => {
	const { currentUser } = useAuth();

	const { data: notificationsData, isFetching: notificationsFetching } = useQuery({
		queryKey: ["notifications-notifications"],
		queryFn: async () => NOTIFICATION_CONTROLLER.FetchAllNotificationsWithUserId(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	return (
		<main className="p-8 mx-auto w-full">
			{notificationsFetching ? (
				<div className="animate-pulse space-y-4">
					<div className="h-128 w-full bg-muted rounded" />
				</div>
			) : (
				<NotificationsOverview
					all_notifications={notificationsData ?? []}
				/>
			)}
		</main>
	);
};