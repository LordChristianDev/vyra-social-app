import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { cn } from "@/lib/utils";
import { createFullName, getInitials, timeAgo } from "@/lib/formatters";

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { CommentProp } from "@/features/dashboard/types/dashboard-types";
import {
	CONTROLLER as COMMENT_CONTROLLER
} from "@/features/dashboard/services/comment-services";
import { MoreHorizontal, Trash2 } from "lucide-react";

export const CommentCard = ({ comment }: { comment: CommentProp }) => {
	const queryClient = useQueryClient();
	const { currentUser } = useAuth();
	const {
		id, created_at, content, all_likes, author_id,
		author: { first_name, last_name, avatar_url, username, privacy_settings: { is_verified } }
	} = comment;

	const [isLiked, setIsLiked] = useState<boolean>(all_likes.includes(currentUser?.id ?? 0));
	const [likes, setLikes] = useState<number[]>(all_likes);

	const fullName: string = createFullName(first_name, last_name);

	// Booleans
	const isOwnPost: boolean = currentUser?.id == author_id;

	const handleLikes = async () => {
		setIsLiked(!isLiked)

		const values: Object = {};
		const set: number[] = isLiked ? all_likes.filter(id =>
			id !== currentUser?.id
		) : [
			...all_likes, currentUser?.id ?? 0
		];

		setLikes(set);

		await COMMENT_CONTROLLER.UpdateCommentWithId(
			id,
			{
				...values,
				all_likes: set,
			},
		);

		queryClient.invalidateQueries({ queryKey: ["home-posts"] });
		queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
	};

	const handleDeleteComment = async () => {
		if (!id) throw new Error("No Unique Identifier!");

		await COMMENT_CONTROLLER.DeleteCommentWithId(id);

		queryClient.invalidateQueries({ queryKey: ["home-posts"] });
		queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
	};

	return (
		<div className="flex gap-3">
			<AvatarIcon
				src={avatar_url ?? ""}
				fallback={getInitials(fullName)}
			/>

			<div className="flex-1">
				<div className="flex items-center justify-between">
					<div className="flex flex-col">
						<div className="bg-muted/50 rounded-lg px-3 py-2">
							<div className="flex items-center gap-2 mb-1">
								<span className="font-medium text-sm">{fullName}</span>
								{is_verified && (
									<Badge className="bg-gradient-primary text-gray-200 px-1 py-0 text-xs">
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
								onClick={() => handleLikes()}
							>
								{likes.length > 0 && likes.length}{"  "}Like
							</Button>
							{/* <Button variant="ghost" size="sm" className="text-xs p-0 h-auto text-muted-foreground hover:text-foreground">
								Reply
							</Button> */}
						</div>
					</div>

					{isOwnPost && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="icon" className="h-8 w-8">
									<MoreHorizontal className="h-4 w-4" />
								</Button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end" className="bg-popover">
								<DropdownMenuItem
									onClick={() => handleDeleteComment()}
									className="text-destructive focus:text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete Comment
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</div>
	);
};