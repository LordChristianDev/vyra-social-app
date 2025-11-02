import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Edit3, Link2, MapPin, UserCheck, UserPlus } from "lucide-react";

import { useProfile } from "@/context/use-profile";
import { useRoutes } from "@/hooks/use-routes";
import { cleanUrl, createFullName, formatIsoString } from "@/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";
import {
	CONTROLLER as NOTIFICATION_CONTROLLER
} from "@/features/personalization/services/notification-services";

type ProfileCardProp = {
	profile: ProfileProp;
	isOwnProfile: boolean;
}

export const ProfileCard = ({ profile, isOwnProfile }: ProfileCardProp) => {
	const queryClient = useQueryClient();
	const { move } = useRoutes();
	const { profile: activeProfile } = useProfile();

	const { created_at, first_name, last_name, username, user_id, bio, location, website_url, all_followers, privacy_settings: { is_verified }, notif_settings: { notify_follows } } = profile;

	const [followed, setFollowed] = useState<boolean>(all_followers.includes(activeProfile.user_id));
	const fullName = createFullName(first_name, last_name);

	const handleFollow = async () => {
		const status = !followed;
		setFollowed(status);

		const result = await PROFILE_CONTROLLER
			.UpdateProfileWithUserId(
				user_id,
				{
					all_followers: followed ? all_followers.filter(id => id !== activeProfile.user_id) : [...all_followers, activeProfile.user_id]
				},
			);

		queryClient.invalidateQueries({ queryKey: ["view-profile-profile"] });
		queryClient.invalidateQueries({ queryKey: ["suggested-profiles"] });

		if (status && result && notify_follows) {
			const result = await NOTIFICATION_CONTROLLER.CreateNewNotification(
				activeProfile.user_id,
				user_id,
				`followed your post`,
				"follow"
			)

			if (result) {
				queryClient.invalidateQueries({ queryKey: ["notification-popover-notifications"] });
			}
		}
	}

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
							<a onClick={() => handleFollow()}>
								<Button variant={followed ? 'check' : 'outline'} className="gap-2 cursor-pointer">
									{followed ? < UserCheck className="h-4 w-4" /> : < UserPlus className="h-4 w-4" />}
									{followed ? 'Following' : 'Follow'}
								</Button>
							</a>
						}

						{isOwnProfile &&
							<Button
								onClick={() => move('/settings')}
								className="hidden md:flex bg-gradient-primary text-white gap-2 cursor-pointer"
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