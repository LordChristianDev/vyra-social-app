import { DisplayPosts } from "@/features/dashboard/components/posts/display-posts";
import { CreatePostCard } from "@/features/dashboard/components/posts/create-post-card";
import { SuggestedProfiles } from "@/features/dashboard/components/additional/suggested-profiles";
import { TrendingTopics } from "@/features/dashboard/components/additional/trending-topics";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";

type HomeOverviewProp = {
	profile: ProfileProp;
	posts: PostProp[];
};

export const HomeOverview = ({ profile, posts }: HomeOverviewProp) => {
	return (
		<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
			<div className="lg:col-span-2 space-y-4">
				{/* Create Post */}
				<CreatePostCard profile={profile ?? {} as ProfileProp} />

				{/* Timeline Posts */}
				<DisplayPosts posts={posts ?? []} />
			</div>

			<div className="lg-col-span-1 space-y-4">
				{/* Suggested Followers */}
				<SuggestedProfiles />

				{/* Trending Topics */}
				<TrendingTopics />
			</div>
		</div>
	);
};