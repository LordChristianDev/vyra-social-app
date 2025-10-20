import { useState } from "react";

import { useProfile } from "@/context/use-profile";
import { cn } from "@/lib/utils";
import { createFullName, getInitials, timeAgo } from "@/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { CommentProp } from "@/features/dashboard/types/dashboard-types";

export const CommentCard = ({ comment }: { comment: CommentProp }) => {
	const { profile } = useProfile();
	const {
		created_at, content, all_likes,
		author: { first_name, last_name, avatar_url, username, privacy_settings: { is_verified } }
	} = comment;

	const [isLiked, setIsLiked] = useState<boolean>(all_likes.includes(profile.id));

	const fullName: string = createFullName(first_name, last_name);

	const handleLike = () => setIsLiked(!isLiked);

	return (
		<div className="flex gap-3">
			<AvatarIcon
				src={avatar_url ?? ""}
				fallback={getInitials(fullName)}
			/>

			<div className="flex-1">
				<div className="bg-muted/50 rounded-lg px-3 py-2">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-medium text-sm">{fullName}</span>
						{is_verified && (
							<Badge className="bg-gradient-primary text-primary-foreground px-1 py-0 text-xs">
								✓
							</Badge>
						)}

						<span className="text-xs text-muted-foreground">
							@{username}
						</span>
					</div>
					<p className="text-sm">{content}</p>
				</div>
				<div className="flex items-center gap-4 mt-1 ml-3">
					<span className="text-xs text-muted-foreground">{timeAgo(created_at)}</span>
					<Button
						variant="ghost"
						size="sm"
						className={cn(
							'text-xs p-0 h-auto hover:text-red-500 transition-smooth',
							isLiked ? "text-red-500" : "text-muted-foreground"
						)}
						onClick={() => handleLike()}
					>
						{all_likes.length > 0}Like
					</Button>
					<Button variant="ghost" size="sm" className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground">
						Reply
					</Button>
				</div>
			</div>
		</div>
	);
};