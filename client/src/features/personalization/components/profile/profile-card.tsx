import { useState } from "react";
import { Calendar, Edit3, Link2, MapPin, UserCheck, UserPlus } from "lucide-react";

import { useRoutes } from "@/hooks/use-routes";
import { cleanUrl, createFullName, formatIsoString } from "@/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SeeMore } from "@/components/common/see-more";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";

type ProfileCardProp = {
	profile: ProfileProp;
	posts: PostProp[];
	isOwnProfile: boolean;
}

export const ProfileCard = ({ profile, posts, isOwnProfile }: ProfileCardProp) => {
	const { move } = useRoutes();

	const { created_at, first_name, last_name, username, bio, location, website_url, description, all_following, all_followers, privacy_settings: { is_verified } } = profile;

	const [followed, setFollowed] = useState<boolean>(all_followers.includes(1));

	const website = cleanUrl(website_url ?? "");
	const fullName = createFullName(first_name, last_name);
	const formatJoinedAt = formatIsoString(created_at);

	const numOfPost = posts.length;
	const numOfFollowers = all_following ? all_followers.length : 0;
	const numOfFollowing = all_following ? all_following.length : 0;

	return (
		<Card className="mb-6 shadow-soft">
			<CardContent className="w-full">
				<div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 w-full">
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h1 className="text-2xl font-bold">{fullName}</h1>
							{is_verified && (
								<Badge className="bg-gradient-primary text-primary-foreground">
									✓
								</Badge>
							)}
						</div>
					</div>

					<div className="flex gap-2">
						{!isOwnProfile &&
							<a onClick={() => setFollowed(!followed)}>
								<Button variant={followed ? 'check' : 'outline'} className="gap-2 cursor-pointer">
									{followed ? < UserCheck className="h-4 w-4" /> : < UserPlus className="h-4 w-4" />}
									{followed ? 'Following' : 'Follow'}
								</Button>
							</a>
						}

						{isOwnProfile &&
							<Button
								onClick={() => move('/settings')}
								className="bg-gradient-primary text-white gap-2 cursor-pointer"
							>
								<Edit3 className="h-4 w-4" />
								Edit Profile
							</Button>
						}
					</div>
				</div>

				<p className="mb-4 text-muted-foreground ">@{username}</p>

				<p className="mb-4 text-sm leading-relaxed">{bio}</p>

				<div className="mb-3 flex flex-wrap gap-6 text-sm text-muted-foreground">
					{location && <div className="flex items-center gap-1">
						<MapPin className="h-4 w-4" />
						{location}
					</div>}

					{website_url && <div className="flex items-center gap-1">
						<Link2 className="h-4 w-4" />
						<a
							href={website_url}
							target="_blank"
							className="text-primary hover:underline"
						>
							{website}
						</a>
					</div>}

					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						Joined on {formatJoinedAt}
					</div>
				</div>

				{description && <div className="text-sm">
					<SeeMore text={description} />
				</div>}

				{/* Stats */}
				<div className="mt-6 pt-6 flex gap-10 border-t border-border/50">
					<div className="text-center">
						<p className="text-lg font-bold">{numOfPost}</p>
						<p className="text-sm text-muted-foreground">Posts</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-bold">{numOfFollowers}</p>
						<p className="text-sm text-muted-foreground">Followers</p>
					</div>
					<div className="text-center">
						<p className="text-lg font-bold">{numOfFollowing}</p>
						<p className="text-sm text-muted-foreground">Following</p>
					</div>
				</div>
			</CardContent>
		</Card >
	);
};