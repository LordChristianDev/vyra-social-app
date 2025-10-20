import { useEffect, useEffectEvent, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { NotificationSettingsProp } from "@/features/personalization/types/settings-types";

export const SettingsNotifications = ({ notification }: { notification: NotificationSettingsProp }) => {
	const [notificationSettings, setNotificationSettings] = useState<Partial<NotificationSettingsProp>>({
		notify_likes: notification.notify_likes,
		notify_comments: notification.notify_comments,
		notify_follows: notification.notify_follows,
		notify_messages: notification.notify_messages,
	});

	const onUpdate = useEffectEvent(() => {
		setNotificationSettings({
			notify_likes: notification.notify_likes,
			notify_comments: notification.notify_comments,
			notify_follows: notification.notify_follows,
			notify_messages: notification.notify_messages,
		});
	});

	useEffect(() => {
		onUpdate();
	}, []);

	return (
		<Card className="shadow-soft" >
			<CardHeader>
				<CardTitle>Notification Preferences</CardTitle>
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="space-y-4">
					{/* Notify Likes */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="likes">Likes</Label>
							<p className="text-sm text-muted-foreground">Get notified when someone likes your posts</p>
						</div>

						<Switch
							checked={notificationSettings.notify_likes}
							onCheckedChange={(value) => setNotificationSettings({ ...notificationSettings, notify_likes: value })}
						/>
					</div>
					<Separator />

					{/* Notify Comments */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="comments">Comments</Label>
							<p className="text-sm text-muted-foreground">Get notified when someone comments on your posts</p>
						</div>

						<Switch
							checked={notificationSettings.notify_comments}
							onCheckedChange={(value) => setNotificationSettings({ ...notificationSettings, notify_comments: value })}
						/>
					</div>
					<Separator />

					{/* Notify Follows */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="follows">New Followers</Label>
							<p className="text-sm text-muted-foreground">Get notified when someone follows you</p>
						</div>

						<Switch
							id="follows"
							checked={notificationSettings.notify_follows}
							onCheckedChange={(value) => setNotificationSettings({ ...notificationSettings, notify_follows: value })}
						/>
					</div>
					<Separator />

					{/* Notify Messages */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="messages">Direct Messages</Label>
							<p className="text-sm text-muted-foreground">Get notified for new direct messages</p>
						</div>

						<Switch
							id="messages"
							checked={notificationSettings.notify_messages}
							onCheckedChange={(value) => setNotificationSettings({ ...notificationSettings, notify_messages: value })}
						/>
					</div>
				</div>
			</CardContent>
		</Card >
	);
};