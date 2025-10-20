import { useEffect, useEffectEvent, useState } from "react";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { PrivacySettingsProp } from "@/features/personalization/types/settings-types";

export const SettingsPrivacy = ({ privacy }: { privacy: PrivacySettingsProp }) => {
	const [privacySettings, setPrivacySettings] = useState<Partial<PrivacySettingsProp>>({
		is_verified: privacy.is_verified,
		is_public: privacy.is_public,
		show_active: privacy.show_active,
	});

	const onUpdate = useEffectEvent(() => {
		setPrivacySettings({
			is_verified: privacy.is_verified,
			is_public: privacy.is_public,
			show_active: privacy.show_active,
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
					{/* Show Active Status */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="verification">Verification</Label>
							<p className="text-sm text-muted-foreground">Show that you are verified</p>
						</div>

						<Switch
							checked={privacySettings.is_verified}
							onCheckedChange={(value) => setPrivacySettings({ ...privacySettings, is_verified: value })}
						/>
					</div>
					<Separator />

					{/* Make Profile Public */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="profileVisible">Public Profile</Label>
							<p className="text-sm text-muted-foreground">Make your profile visible to everyone</p>
						</div>

						<Switch
							checked={privacySettings.is_public}
							onCheckedChange={(value) => setPrivacySettings({ ...privacySettings, is_public: value })}
						/>
					</div>
					<Separator />

					{/* Show Active Status */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="activityStatus">Activity Status</Label>
							<p className="text-sm text-muted-foreground">Show when you're online to others</p>
						</div>

						<Switch
							checked={privacySettings.show_active}
							onCheckedChange={(value) => setPrivacySettings({ ...privacySettings, show_active: value })}
						/>
					</div>
				</div>
			</CardContent>
		</Card >
	);
};