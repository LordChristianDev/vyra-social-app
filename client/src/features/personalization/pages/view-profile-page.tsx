
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

import { useProfile } from "@/context/use-profile";

import { ProfileOverview } from "@/features/personalization/components/profile/profile-overview";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as POST_CONTROLLER
} from "@/features/dashboard/services/post-services";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

export default function ViewProfilePage() {
	const { id: user_id } = useParams<{ id: string }>();
	const identifier: number = Number(user_id);

	return (
		<ViewProfileContent user_id={identifier} />
	);
};

const ViewProfileContent = ({ user_id }: { user_id: number }) => {
	const { profile } = useProfile();

	const { data: profileData, isLoading: profileLoading } = useQuery({
		queryKey: ["view-profile-profile", user_id],
		queryFn: () => PROFILE_CONTROLLER.FetchProfileWithUserId(user_id),
		refetchOnMount: true,
		enabled: !!user_id,
		staleTime: 0,
	});

	const { data: postsData, isLoading: postsLoading } = useQuery({
		queryKey: ["view-profile-posts", user_id],
		queryFn: () => POST_CONTROLLER.FetchAllPostsWithAuthorId(user_id),
		refetchOnMount: true,
		enabled: !!user_id,
		staleTime: 0,
	});

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
				<>
					{profileData ? (
						<ProfileOverview
							profile={profileData as ProfileProp}
							posts={postsData as PostProp[]}
							isOwnProfile={profile.user_id === user_id}
						/>
					) : (
						<div className="mx-auto my-auto py-4 flex flex-col justify-center items-center h-60">
							<h2 className="text-2xl font-semibold ">Profile not found</h2>
							<p className="text-sm text-muted-foreground">How did you get here ? </p>
						</div>
					)}
				</>
			)}
		</main>
	);

};