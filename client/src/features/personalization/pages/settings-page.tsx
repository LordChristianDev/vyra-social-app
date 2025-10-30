import { useEffect, useEffectEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { useProfile } from "@/context/use-profile";

import { SettingsOverview } from "@/features/personalization/components/settings/settings-overview";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

export default function SettingsPage() {
	return (
		<SettingsContent />
	);
};

const SettingsContent = () => {
	const { currentUser } = useAuth();
	const { storeProfile } = useProfile();

	const { data: profileData, isLoading: profileLoading } = useQuery({
		queryKey: ["settings-profile", currentUser?.id],
		queryFn: () => PROFILE_CONTROLLER.FetchProfileWithUserId(currentUser?.id ?? 0),
		refetchOnMount: !!currentUser?.id,
		enabled: true,
		staleTime: 0,
	});

	const onFetch = useEffectEvent(() => {
		if (profileData && !profileLoading) {
			storeProfile(profileData);
		}
	});

	useEffect(() => {
		onFetch();
	}, []);

	return (
		<main className="p-8 mx-auto w-full">
			{profileLoading ? (
				<div className="animate-pulse space-y-6">
					<div className="h-8 w-full bg-muted rounded" />
					<div className="h-128 w-full bg-muted rounded" />
				</div>
			) : (
				<SettingsOverview
					profile={profileData as ProfileProp}
				/>
			)}
		</main>
	);
};