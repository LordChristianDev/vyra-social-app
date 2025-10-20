import { useEffectEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useProfile } from "@/context/use-profile";

import { ProfileOverview } from "@/features/personalization/components/profile/profile-overview";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { QUERIES as POST_QUERIES } from "@/features/dashboard/services/post-services";
import { QUERIES as PROFILE_QUERIES } from "@/features/personalization/services/profile-services";

export default function ProfilePage() {
	return (
		<ProfileContent />
	);
};

const ProfileContent = () => {
	const { storeProfile } = useProfile();

	const { data: profileData, isFetching: profileFetching } = useQuery({
		queryKey: ["profile-page"],
		queryFn: () => PROFILE_QUERIES.fetchProfileWithUserId(1),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
		staleTime: 0,
	});

	const { data: postsData, isFetching: postsFetching } = useQuery({
		queryKey: ["profile-posts"],
		queryFn: () => POST_QUERIES.fetchPostsByAuthorId(1),
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
			{profileFetching || postsFetching ? (
				<div className="animate-pulse space-y-4">
					<div className="h-48 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
				</div>
			) : (
				<ProfileOverview
					profile={profileData as ProfileProp}
					posts={postsData as PostProp[]}
					isOwnProfile={true}
				/>
			)}
		</main>
	);
};