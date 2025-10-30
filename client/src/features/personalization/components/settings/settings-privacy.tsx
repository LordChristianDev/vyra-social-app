import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { showToast } from "@/lib/show-toast";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import type { PrivacySettingsProp } from "@/features/personalization/types/settings-types";
import { CONTROLLER as SETTINGS_CONTROLLER } from "@/features/personalization/services/settings-services";

export const SettingsPrivacy = ({ privacy }: { privacy: PrivacySettingsProp }) => {
	const [privacySettings, setPrivacySettings] = useState<Partial<PrivacySettingsProp>>({
		is_verified: privacy.is_verified,
		is_public: privacy.is_public,
		show_active: privacy.show_active,
	});
	const { currentUser } = useAuth();
	const queryClient = useQueryClient();

	const handlePrivacyUpdate = async (key: keyof PrivacySettingsProp, value: boolean) => {
		setPrivacySettings({ ...privacySettings, [key]: value });

		if (!currentUser?.id) {
			showToast({
				title: "Something went Wrong!",
				description: "Unable to complete this update.",
				variant: "error"
			});
			return;
		}

		const response = await SETTINGS_CONTROLLER
			.UpdatePrivacySettingsWithUserId(
				currentUser?.id,
				{ ...privacySettings, [key]: value }
			);

		if (!response) {
			showToast({
				title: "Update Failed!",
				description: "Failed to update privacy settings.",
				variant: "error"
			});
			return;
		}

		showToast({
			title: "Updated Settings Successfully!",
			description: "Privacy settings has been updated.",
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
					{/* Show Active Status */}
					<div className="flex items-center justify-between">
						<div>
							<Label htmlFor="verification">Verification</Label>
							<p className="text-sm text-muted-foreground">Show that you are verified</p>
						</div>

						<Switch
							checked={privacySettings.is_verified}
							onCheckedChange={(value) => handlePrivacyUpdate("is_verified", value)}
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
							onCheckedChange={(value) => handlePrivacyUpdate("is_public", value)}
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
							onCheckedChange={(value) => handlePrivacyUpdate("show_active", value)}
						/>
					</div>
				</div>
			</CardContent>
		</Card >
	);
};