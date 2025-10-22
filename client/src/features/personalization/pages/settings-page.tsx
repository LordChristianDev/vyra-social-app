import { useEffect, useEffectEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { useProfile } from "@/context/use-profile";

import { SettingsOverview } from "@/features/personalization/components/settings/settings-overview";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { QUERIES } from "@/features/personalization/services/profile-services";

export default function SettingsPage() {
	return (
		<SettingsContent />
	);
};

const SettingsContent = () => {
	const { storeProfile } = useProfile();

	const { data: profileData, isFetching: profileFetching } = useQuery({
		queryKey: ["settings-profile"],
		queryFn: () => QUERIES.fetchProfileWithUserId(1),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
		staleTime: 0,
	});

	const onFetch = useEffectEvent(() => {
		if (profileData && !profileFetching) {
			storeProfile(profileData);
		}
	});

	useEffect(() => {
		onFetch();
	}, []);

	return (
		<main className="p-8 mx-auto w-full">
			{profileFetching ? (
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

