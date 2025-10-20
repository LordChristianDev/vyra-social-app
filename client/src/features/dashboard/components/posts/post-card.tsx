import { useState } from "react";
import { Bookmark, Edit, Heart, MessageCircle, MoreHorizontal, Share, Trash2 } from "lucide-react";

import { useProfile } from "@/context/use-profile";
import { cn } from "@/lib/utils";
import { createFullName, getInitials, timeAgo } from "@/lib/formatters";

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

export const PostCard = ({ post }: { post: PostProp }) => {
	const { profile } = useProfile();
	const [showComments, setShowComments] = useState<boolean>(false);
	const [isEditPostDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
	const [isDeletePostDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);

	const {
		author_id, created_at, content, images, youtube_embed, comments, all_likes, all_saved, all_shares,
		author: { first_name, last_name, username, avatar_url, privacy_settings: { is_verified } }
	} = post;

	const [isLiked, setIsLiked] = useState<boolean>(all_likes.includes(profile.id));
	const [isShared, setIsShared] = useState<boolean>(all_shares.includes(profile.id));
	const [isSaved, setIsSaved] = useState<boolean>(all_saved.includes(profile.id));

	// Strings
	const fullName: string = createFullName(first_name, last_name);

	// Booleans
	const isOwnPost: boolean = profile.id == author_id;

	const handleLikes = () => setIsLiked(!isLiked);
	const handleShares = () => setIsShared(!isShared);
	const handleSaves = () => setIsSaved(!isSaved);

	return (
		<Card className="mb-6 shadow-soft border-border/50">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<AvatarIcon
							src={avatar_url ?? ""}
							fallback={getInitials(fullName)}
							size="md"
						/>

						<div>
							<div className="flex items-center gap-2">
								<h4 className="font-semibold">{fullName}</h4>
								{is_verified && (
									<Badge className="px-1.5 py-0.5 text-xs text-primary-foreground bg-gradient-primary">
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
				<p className="mb-4 text-sm">{content}</p>

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
							<span className="text-sm">{all_likes.length}</span>
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
							<span className="text-sm">{all_shares.length}</span>
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
					<CommentsSection comments={comments ?? []} />
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
