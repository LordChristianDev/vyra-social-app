import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { showToast } from "@/lib/show-toast";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { NotificationSettingsProp } from "@/features/personalization/types/settings-types";
import {
	CONTROLLER as SETTINGS_CONTROLLER
} from "@/features/personalization/services/settings-services";

export const SettingsNotifications = ({ notification }: { notification: NotificationSettingsProp }) => {
	const [notificationSettings, setNotificationSettings] = useState<Partial<NotificationSettingsProp>>({
		notify_likes: notification.notify_likes,
		notify_comments: notification.notify_comments,
		notify_follows: notification.notify_follows,
		notify_messages: notification.notify_messages,
	});
	const { currentUser } = useAuth();
	const queryClient = useQueryClient();

	const handleNotificationUpdate = async (key: keyof NotificationSettingsProp, value: boolean) => {
		setNotificationSettings({ ...notificationSettings, [key]: value });

		if (!currentUser?.id) {
			showToast({
				title: "Something went Wrong!",
				description: "Unable to complete this update.",
				variant: "error"
			});
			return;
		}

		const response = await SETTINGS_CONTROLLER
			.UpdateNotificationSettingsWithUserId(
				currentUser?.id,
				{ ...notificationSettings, [key]: value }
			);

		if (!response) {
			showToast({
				title: "Update Failed!",
				description: "Failed to update notification settings.",
				variant: "error"
			});
			return;
		}

		showToast({
			title: "Updated Settings Successfully!",
			description: "Notification settings has been updated.",
			variant: "success"
		});
		queryClient.invalidateQueries({ queryKey: ["settings-profile"] });
	};

	return (
		<Card className="shadow-soft" >
			<CardHeader>
				<CardTitle>Notification Preferences</CardTitle>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="space-y-4">
					{/* Notify Likes */}
					<div className="flex items-center justify-between">
						<div className="pr-4">
							<Label htmlFor="likes">Likes</Label>
							<p className="text-sm text-muted-foreground">Get notified when someone likes your posts</p>
						</div>

						<Switch
							checked={notificationSettings.notify_likes}
							onCheckedChange={(value) => handleNotificationUpdate("notify_likes", value)}
						/>
					</div>
					<Separator />

					{/* Notify Comments */}
					<div className="flex items-center justify-between">
						<div className="pr-4">
							<Label htmlFor="comments">Comments</Label>
							<p className="text-sm text-muted-foreground">Get notified when someone comments on your posts</p>
						</div>

						<Switch
							checked={notificationSettings.notify_comments}
							onCheckedChange={(value) => handleNotificationUpdate("notify_comments", value)}
						/>
					</div>
					<Separator />

					{/* Notify Follows */}
					<div className="flex items-center justify-between">
						<div className="pr-4">
							<Label htmlFor="follows">New Followers</Label>
							<p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
						</div>

						<Switch
							id="follows"
							checked={notificationSettings.notify_follows}
							onCheckedChange={(value) => handleNotificationUpdate("notify_follows", value)}
						/>
					</div>
					<Separator />

					{/* Notify Messages */}
					<div className="flex items-center justify-between">
						<div className="pr-4">
							<Label htmlFor="messages">Direct Messages</Label>
							<p className="text-sm text-muted-foreground">Get notified for new direct messages</p>
						</div>

						<Switch
							id="messages"
							checked={notificationSettings.notify_messages}
							onCheckedChange={(value) => handleNotificationUpdate("notify_messages", value)}
						/>
					</div>
				</div>
			</CardContent>
		</Card >
	);
};