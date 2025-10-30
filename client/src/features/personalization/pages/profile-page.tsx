import { useEffectEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { useProfile } from "@/context/use-profile";

import { ProfileOverview } from "@/features/personalization/components/profile/profile-overview";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { QUERIES as POST_QUERIES } from "@/features/dashboard/services/post-services";
import { CONTROLLER as PROFILE_CONTROLLER } from "@/features/personalization/services/profile-services";

export default function ProfilePage() {
	return (
		<ProfileContent />
	);
};

const ProfileContent = () => {
	const { currentUser } = useAuth();
	const { storeProfile } = useProfile();

	const { data: profileData, isLoading: profileLoading } = useQuery({
		queryKey: ["profile-profile", currentUser?.id],
		queryFn: () => PROFILE_CONTROLLER.FetchProfileWithUserId(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	const { data: postsData, isLoading: postsLoading } = useQuery({
		queryKey: ["profile-posts"],
		queryFn: () => POST_QUERIES.fetchPostsByAuthorId(1),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
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
			{profileLoading || postsLoading ? (
				<div className="animate-pulse space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<div className="lg:col-span-2 space-y-4">
							<div className="h-56 w-full bg-muted rounded" />
							<div className="h-48 w-full bg-muted rounded" />
							<div className="h-12 w-full bg-muted rounded" />
							<div className="h-48 w-full bg-muted rounded" />
						</div>
						<div className="lg:col-span-1 space-y-4">
							<div className="h-72 w-full bg-muted rounded" />
							<div className="h-72 w-full bg-muted rounded" />
						</div>
					</div>
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