import { useState, useEffectEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useProfile } from "@/context/use-profile";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DisplayPosts } from "@/features/dashboard/components/posts/display-posts";
import { ProfileCard } from "@/features/personalization/components/profile/profile-card";
import { ProfileCover } from "@/features/personalization/components/profile/profile-cover";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { QUERIES as POST_QUERIES } from "@/features/dashboard/services/post-services";
import { QUERIES as PROFILE_QUERIES } from "@/features/personalization/services/profile-services";

export default function ProfilePage() {
	return (
		<ProfileContent />
	);
};

const ProfileContent = () => {
	const [activeTab, setActiveTab] = useState("posts");
	const { profile, storeProfile } = useProfile();

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
				<>
					{/* Cover Image */}
					<ProfileCover profile={profile as ProfileProp} />

					{/* Profile Info */}
					<ProfileCard
						profile={profile as ProfileProp}
						posts={postsData ?? []}
						isOwnProfile={true}
					/>

					{/* Content Tabs */}
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="mb-6 grid w-full grid-cols-3">
							<TabsTrigger value="posts" className="cursor-pointer">Posts</TabsTrigger>
							<TabsTrigger value="media" className="cursor-pointer">Media</TabsTrigger>
							<TabsTrigger value="saved" className="cursor-pointer">Saved</TabsTrigger>
						</TabsList>

						<TabsContent value="posts">
							<div className="space-y-6">
								<DisplayPosts posts={postsData ?? []} />
							</div>
						</TabsContent>

						<TabsContent value="media">
							<div className="text-center py-12">
								<p className="text-muted-foreground">No media posts yet</p>
							</div>
						</TabsContent>

						<TabsContent value="saved">
							<div className="text-center py-12">
								<p className="text-muted-foreground">No savedposts to show</p>
							</div>
						</TabsContent>
					</Tabs>
				</>
			)}
		</main>
	);
};