import { Card, CardContent } from "@/components/ui/card";
import { SeeMore } from "@/components/common/see-more";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "../../types/profile-types";

type ProfileInfoProp = {
	profile: ProfileProp;
	posts: PostProp[];
};

export const ProfileInfo = ({ profile, posts }: ProfileInfoProp) => {
	const { description, all_followers, all_following } = profile as ProfileProp;

	return (
		<Card className="mb-6 shadow-soft">
			<CardContent>
				<h2 className="mb-2">Profile Description</h2>
				{description ? (
					<div className="text-sm">
						<SeeMore text={description} />
					</div>
				) : (
					<p className="text-muted-foreground">No description provided</p>
				)}

				<div className="mt-6 pt-6 flex gap-10 border-t border-border/50">
					<div className="text-center">
						<p className="text-lg font-bold">{posts.length}</p>
						<p className="text-sm text-muted-foreground">Posts</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-bold">{all_followers.length}</p>
						<p className="text-sm text-muted-foreground">Followers</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-bold">{all_following.length}</p>
						<p className="text-sm text-muted-foreground">Following</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};