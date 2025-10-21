import { useEffect, useEffectEvent } from "react";
import { useQuery } from "@tanstack/react-query";

import { useProfile } from "@/context/use-profile";

import { HomeOverview } from "@/features/dashboard/components/home/home-overview";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { QUERIES as POST_QUERIES } from "@/features/dashboard/services/post-services";
import { QUERIES as PROFILE_QUERIES } from "@/features/personalization/services/profile-services";

export default function HomePage() {
	return (
		<HomeContent />
	);
};

const HomeContent = () => {
	const { storeProfile } = useProfile();

	const { data: profileData, isFetching: profileFetching } = useQuery({
		queryKey: ["profile-page"],
		queryFn: () => PROFILE_QUERIES.fetchProfileWithUserId(1),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
		staleTime: 0,
	});

	const { data: postsData, isFetching: postsFetching } = useQuery({
		queryKey: ["home-posts"],
		queryFn: () => POST_QUERIES.fetchPosts(),
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
			{postsFetching ? (
				<div className="animate-pulse space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
						<div className="lg:col-span-2 space-y-4">
							<div className="h-32 w-full bg-muted rounded" />
							<div className="h-72 w-full bg-muted rounded" />
							<div className="h-72 w-full bg-muted rounded" />
						</div>

						<div className="lg:col-span-1 space-y-4">
							<div className="h-48 w-full bg-muted rounded" />
							<div className="h-48 w-full bg-muted rounded" />
						</div>
					</div>
				</div>
			) : (
				<HomeOverview
					profile={profileData as ProfileProp}
					posts={postsData as PostProp[]}
				/>
			)}
		</main>
	);
};
