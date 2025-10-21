import { usePersistedState } from "@/hooks/use-persisted-state";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DisplayPosts } from "@/features/dashboard/components/posts/display-posts";
import { ProfileCard } from "@/features/personalization/components/profile/profile-card";
import { ProfileCover } from "@/features/personalization/components/profile/profile-cover";
import { ProfileInfo } from "@/features/personalization/components/profile/profile-info";
import { SuggestedProfiles } from "@/features/dashboard/components/additional/suggested-profiles";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";

type ProfileOverviewProp = {
	profile: ProfileProp;
	posts: PostProp[];
	isOwnProfile: boolean;
}

export const ProfileOverview = ({ profile, posts, isOwnProfile }: ProfileOverviewProp) => {
	const [profileActiveTab, setProfileActiveTab] = usePersistedState("profileActiveTab", "posts");

	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
			<div className="lg:col-span-2 space-y-4">
				{/* Cover Image */}
				<ProfileCover profile={profile as ProfileProp} />

				{/* Profile Info */}
				<ProfileCard
					profile={profile as ProfileProp}
					isOwnProfile={isOwnProfile}
				/>

				{/* Content Tabs */}
				<Tabs value={profileActiveTab} onValueChange={setProfileActiveTab}>
					<TabsList className="mb-6 grid w-full grid-cols-3">
						<TabsTrigger value="posts" className="cursor-pointer">Posts</TabsTrigger>
						<TabsTrigger value="media" className="cursor-pointer">Media</TabsTrigger>
						<TabsTrigger value="saved" className="cursor-pointer">Saved</TabsTrigger>
					</TabsList>

					<TabsContent value="posts">
						<div className="space-y-6">
							<DisplayPosts posts={posts ?? []} />
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
			</div>

			<div className="lg-col-span-1 space-y-4">
				{/* Suggested Followers */}
				<SuggestedProfiles />

				{/* Addtional Information */}
				<ProfileInfo
					profile={profile as ProfileProp}
					posts={posts ?? []}
				/>
			</div>
		</div>
	);
};