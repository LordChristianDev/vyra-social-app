import { useState } from "react";
import { Link } from 'react-router-dom';
import { useQueryClient } from "@tanstack/react-query";
import { Bookmark, Edit, Heart, MessageCircle, MoreHorizontal, Share, Trash2 } from "lucide-react";

import { useAuth } from "@/context/use-auth";
import { cn } from "@/lib/utils";
import { createFullName, getInitials, removeYouTubeLinks, timeAgo } from "@/lib/formatters";

import {
	Card,
	CardContent,
	CardFooter,
	CardHeader
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { ShowPostImages } from "@/features/dashboard/components/posts/show-post-images";
import { EditPostDialog } from "@/features/dashboard/components/posts/edit-post-dialog";
import { DeletePostDialog } from "@/features/dashboard/components/posts/delete-post-dialog";
import { CommentsSection } from "@/features/dashboard/components/comments/comments-section";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import {
	CONTROLLER as POST_CONTROLLER
} from "@/features/dashboard/services/post-services";
import {
	CONTROLLER as NOTIFICATION_CONTROLLER
} from "@/features/personalization/services/notification-services";

export const PostCard = ({ post }: { post: PostProp }) => {
	const queryClient = useQueryClient();
	const { currentUser } = useAuth();
	const [showComments, setShowComments] = useState<boolean>(false);
	const [isEditPostDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
	const [isDeletePostDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

	const {
		id, author_id, created_at, content, images, youtube_embed, tags, comments, all_likes, all_saved, all_shares,
		author: { first_name, last_name, username, avatar_url, privacy_settings, notif_settings }
	} = post as PostProp;

	const [isLiked, setIsLiked] = useState<boolean>(all_likes.includes(currentUser?.id ?? 0));
	const [isShared, setIsShared] = useState<boolean>(all_shares.includes(currentUser?.id ?? 0));
	const [isSaved, setIsSaved] = useState<boolean>(all_saved.includes(currentUser?.id ?? 0));

	const [likes, setLikes] = useState<number[]>(all_likes);
	const [shares, setShares] = useState<number[]>(all_shares);

	// Strings
	const fullName: string = createFullName(first_name, last_name);

	// Booleans
	const isOwnPost: boolean = currentUser?.id == author_id;

	const handleLikes = async () => {
		const status = !isLiked;
		setIsLiked(status)

		const values: Object = {};
		const set: number[] = isLiked ? likes.filter(id =>
			id !== currentUser?.id
		) : [
			...likes, currentUser?.id ?? 0
		];

		setLikes(set);

		await POST_CONTROLLER.EditPostWithId(
			id,
			{
				...values,
				all_likes: set,
			},
		);

		if (status && notif_settings.notify_likes && (currentUser?.id !== author_id)) {
			const result = await NOTIFICATION_CONTROLLER.CreateNewNotification(
				currentUser?.id ?? 0,
				author_id,
				`liked your post`,
				"like"
			)

			if (result) {
				queryClient.invalidateQueries({ queryKey: ["notification-popover-notifications"] });
			}

		}

		queryClient.invalidateQueries({ queryKey: ["home-posts"] });
		queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
	};
	const handleShares = async () => {
		const status = !isShared;
		setIsShared(status);

		const values: Object = {};
		const set: number[] = isShared ? shares.filter(id =>
			id !== currentUser?.id
		) : [
			...shares, currentUser?.id ?? 0
		];

		setShares(set);

		await POST_CONTROLLER.EditPostWithId(
			id,
			{
				...values,
				all_shares: set,
			},
		);

		if (status && notif_settings.notify_likes && (currentUser?.id !== author_id)) {
			const result = await NOTIFICATION_CONTROLLER.CreateNewNotification(
				currentUser?.id ?? 0,
				author_id,
				`shared your post`,
				"share"
			)

			if (result) {
				queryClient.invalidateQueries({ queryKey: ["notification-popover-notifications"] });
			}
		}

		queryClient.invalidateQueries({ queryKey: ["home-posts"] });
		queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
	};

	const handleSaves = async () => {
		setIsSaved(!isSaved)

		const values: Object = {};
		const set: number[] = isSaved ? all_saved.filter(id =>
			id !== currentUser?.id
		) : [
			...all_saved, currentUser?.id ?? 0
		];

		await POST_CONTROLLER.EditPostWithId(
			id,
			{
				...values,
				all_saved: set,
			},
		);

		queryClient.invalidateQueries({ queryKey: ["home-posts"] });
		queryClient.invalidateQueries({ queryKey: ["profile-posts"] });
	};

	const renderTags = (tags ?? []).map(tags => (
		<Badge key={tags.id} className="space-x-4 px-1.5 py-0.5 text-xs text-white bg-gradient-primary">
			{tags.title}
		</Badge>
	))

	return (
		<Card className="mb-6 shadow-soft border-border/50">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Link to={`/view-profile/${author_id}`}>
							<AvatarIcon
								src={avatar_url ?? ""}
								fallback={getInitials(fullName)}
								size="md"
							/>
						</Link>

						<div>
							<div className="flex items-center gap-2">
								<h4 className="font-semibold">{fullName}</h4>
								{privacy_settings && privacy_settings.is_verified && (
									<Badge className="px-1.5 py-0.5 text-xs text-gray-200 bg-gradient-primary">
										✓
									</Badge>
								)}
							</div>
							<p className="text-sm text-muted-foreground">@{username} · {timeAgo(created_at)}</p>
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
								<DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
									<Edit className="mr-2 h-4 w-4" />
									Edit Post
								</DropdownMenuItem>

								<DropdownMenuItem
									onClick={() => setIsDeleteDialogOpen(true)}
									className="text-destructive focus:text-destructive"
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Delete Post
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</CardHeader>

			<CardContent>
				<p className="mb-4 text-sm">{removeYouTubeLinks(content).trim()}</p>

				{images && images.length > 0 && (
					<ShowPostImages images={images} />
				)}

				{/* YouTube Video */}
				{youtube_embed && (
					<div className="mb-3 aspect-video bg-muted rounded-lg overflow-hidden">
						<iframe
							src={`https://www.youtube.com/embed/${youtube_embed}`}
							title="YouTube video"
							className="w-full h-full"
							allowFullScreen
						/>
					</div>
				)}

				{tags && tags.length > 0 && (
					<div className="flex justify-end space-x-2 ">
						{renderTags}
					</div>
				)}
			</CardContent>

			<Separator />

			<CardFooter className="py-2">
				<div className="flex items-center justify-between w-full">
					<div className="flex items-center gap-4">
						<Button
							variant="ghost"
							size="sm"
							className={cn(
								'gap-2 hover:text-red-500 transition-smooth',
								isLiked ? "text-red-500" : "text-muted-foreground"
							)}
							onClick={() => handleLikes()}
						>
							<Heart className={cn(
								'h-4 w-4',
								isLiked ? "fill-current" : ""
							)} />
							<span className="text-sm">{likes.length}</span>
						</Button>

						<Button
							variant="ghost"
							size="sm"
							className={cn(
								'gap-2 hover:blue-red-500 transition-smooth',
								showComments && comments && comments?.length > 0 ? "text-blue-500" : "text-muted-foreground"
							)}
							onClick={() => setShowComments(!showComments)}
						>
							<MessageCircle className={cn(
								'h-4 w-4',
								showComments && comments && comments?.length > 0 ? "fill-current" : ""
							)} />
							<span className="text-sm">{comments ? comments?.length : 0}</span>
						</Button>

						<Button
							variant="ghost"
							size="sm"
							className={cn(
								'gap-2 hover:green-red-500 transition-smooth',
								isShared ? "text-green-500" : "text-muted-foreground"
							)}
							onClick={() => handleShares()}
						>
							<Share className={cn(
								'h-4 w-4',
								isShared ? "fill-current" : ""
							)}
							/>
							<span className="text-sm">{shares.length}</span>
						</Button>
					</div>

					<Button
						variant="ghost"
						size="sm"
						className={cn(
							'hover:text-primary transition-smooth',
							isSaved ? "text-primary" : "text-muted-foreground"
						)}
						onClick={() => handleSaves()}
					>
						<Bookmark className={cn(
							'h-4 w-4',
							isSaved ? "fill-current" : "")} />
					</Button>
				</div>
			</CardFooter>

			{/* Comments Section */}
			{showComments && (
				<>
					<Separator />
					<CommentsSection
						post={post as PostProp}
						comments={comments ?? []}
					/>
				</>
			)}

			{/* Edit Dialog */}
			{isOwnPost && (
				<EditPostDialog
					open={isEditPostDialogOpen}
					onOpenChange={setIsEditDialogOpen}
					post={post}
				/>
			)}

			{/* Delete Dialog */}
			{isOwnPost && (
				<DeletePostDialog
					open={isDeletePostDialogOpen}
					onOpenChange={setIsDeleteDialogOpen}
					post={post}
				/>
			)}
		</Card>
	);
};
