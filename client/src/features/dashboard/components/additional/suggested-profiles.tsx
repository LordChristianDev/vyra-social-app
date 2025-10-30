import { UserPlus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { createFullName, getInitials } from "@/lib/formatters";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

export const SuggestedProfiles = () => {
	const { currentUser } = useAuth();

	const { data: profilesData, isFetching: profilesFetching } = useQuery({
		queryKey: ["suggested-profiles", currentUser?.id],
		queryFn: () => PROFILE_CONTROLLER.FetchAllSuggestedProfiles(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	const renderProfiles = (profilesData ?? []).map((profile) => {
		const { id, first_name, last_name, avatar_url, username, all_followers } = profile as ProfileProp;

		const fullName = createFullName(first_name, last_name);

		return (
			<div key={id} className="flex items-center justify-between rounded-md hover:bg-secondary/60 cursor-pointer">
				<div className="flex items-center gap-3 flex-1 min-w-0">
					<AvatarIcon
						src={avatar_url ?? ""}
						fallback={getInitials(fullName)}
						size="lg"
					/>
					<div className="flex-1 min-w-0">
						<p className="font-medium text-md truncate">{fullName}</p>
						<p className="text-sm text-muted-foreground truncate">@{username}</p>
						<p className="text-sm text-muted-foreground">{all_followers.length} followers</p>
					</div>
				</div>
				<Button size="default" variant="outline" className="shrink-0 cursor-pointer">Follow</Button>
			</div>
		);
	})

	return (
		profilesFetching ? (
			<div className="animate-pulse space-y-4">
				<div className="h-72 w-full bg-muted rounded" />
			</div>
		) : (
			<Card className="shadow-soft border-border/50">
				<CardHeader>
					<CardTitle className="text-lg font-semibold flex items-center gap-2">
						<UserPlus className="h-5 w-5 text-primary" />
						Who to follow
					</CardTitle >
				</CardHeader >

				<CardContent className="pb-2 space-y-4">
					{!profilesData || profilesData.length === 0 ? (
						<p className="text-center text-muted-foreground">No Suggested Profiles</p>
					) : (
						<>{renderProfiles}</>
					)}
					{profilesData && profilesData.length > 0 && (
						<Button variant="ghost" className="w-full text-primary hover:text-primary hover:bg-primary/10 cursor-pointer">
							Show more
						</Button>
					)}
				</CardContent>
			</Card >
		)
	);
};