import { useState } from "react";
import { Calendar, Edit3, Link2, MapPin, UserCheck, UserPlus } from "lucide-react";

import { useRoutes } from "@/hooks/use-routes";
import { cleanUrl, createFullName, formatIsoString } from "@/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { ProfileProp } from "@/features/personalization/types/profile-types";

type ProfileCardProp = {
	profile: ProfileProp;
	isOwnProfile: boolean;
}

export const ProfileCard = ({ profile, isOwnProfile }: ProfileCardProp) => {
	const { move } = useRoutes();

	const { created_at, first_name, last_name, username, bio, location, website_url, all_followers, privacy_settings: { is_verified } } = profile;

	const [followed, setFollowed] = useState<boolean>(all_followers.includes(1));
	const fullName = createFullName(first_name, last_name);


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
							{cleanUrl(website_url ?? "")}
						</a>
					</div>}

					<div className="flex items-center gap-1">
						<Calendar className="h-4 w-4" />
						Joined on {formatIsoString(created_at)}
					</div>
				</div>
			</CardContent>
		</Card >
	);
};