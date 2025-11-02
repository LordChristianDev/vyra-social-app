import { User, Bell, Shield } from "lucide-react";

import { usePersistedState } from "@/hooks/use-persisted-state";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { SettingsProfile } from "@/features/personalization/components/settings/settings-profile";
import { SettingsNotifications } from "@/features/personalization/components/settings/settings-notifications";
import { SettingsPrivacy } from "@/features/personalization/components/settings/settings-privacy";

import type { ProfileProp } from "@/features/personalization/types/profile-types";

export const SettingsOverview = ({ profile }: { profile: ProfileProp }) => {
	const [settingsActiveTab, setSettingsActiveTab] = usePersistedState("settingsActiveTab", "profile");

	return (
		<Tabs value={settingsActiveTab} onValueChange={setSettingsActiveTab} className="space-y-6">
			{/* Settings Tabs  */}
			<TabsList className="grid w-full grid-cols-3">
				<TabsTrigger value="profile" className="gap-2 cursor-pointer">
					<User className="h-4 w-4" />
					<span className="hidden md:flex">Profile</span>
				</TabsTrigger>

				<TabsTrigger value="notifications" className="gap-2 cursor-pointer">
					<Bell className="h-4 w-4" />
					<span className="hidden md:flex">Notifications</span>
				</TabsTrigger>

				<TabsTrigger value="privacy" className="gap-2 cursor-pointer">
					<Shield className="h-4 w-4" />
					<span className="hidden md:flex">Privacy</span>
				</TabsTrigger>
			</TabsList>

			{/* Profile Information */}
			<TabsContent value="profile">
				<SettingsProfile profile={profile} />
			</TabsContent>

			{/* Notifications */}
			<TabsContent value="notifications">
				<SettingsNotifications notification={profile.notif_settings} />
			</TabsContent>

			<TabsContent value="privacy">
				<SettingsPrivacy privacy={profile.privacy_settings} />
			</TabsContent>
		</Tabs>
	);
};