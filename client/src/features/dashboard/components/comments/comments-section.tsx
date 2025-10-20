import { useCallback, useEffect, useState } from "react";
import { Send } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { useProfile } from "@/context/use-profile";
import { showToast } from "@/lib/show-toast";

import { Button } from "@/components/ui/button";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { CommentCard } from "@/features/dashboard/components/comments/comment-card";

import type { CommentProp } from "@/features/dashboard/types/dashboard-types";
import { createFullName, getInitials } from "@/lib/formatters";

export const CommentsSection = ({ comments }: { comments: CommentProp[] }) => {
	const { profile } = useProfile();
	const { first_name, last_name, avatar_url } = profile;

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [visibleComments, setVisibleComments] = useState<CommentProp[]>([]);
	const [loadCount, setLoadCount] = useState<number>(5);

	const [newComment, setNewComment] = useState<string>("");

	useEffect(() => {
		setVisibleComments(comments.slice(0, loadCount));
	}, [comments, loadCount]);

	const fullName = createFullName(first_name, last_name);

	const loadMoreComments = useCallback(() => {
		setLoadCount(prev => Math.min(prev + 5, comments.length));
	}, [comments.length]);

	const handleSubmit = async () => {
		if (!newComment.trim()) {
			showToast({
				title: "Empty",
				description: "Failed to post comment. Please add a comment",
				variant: "error",
			});
			return;
		}
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			setNewComment("");
			showToast({
				title: "Comment posted!",
				description: "Your comment has been added successfully",
				variant: "success"
			});
		}, 3000);
	};

	const renderAllComments = visibleComments.map((comment, index) => {
		return (
			<CommentCard key={index} comment={comment} />
		);
	})

	return (
		<div className="p-4 space-y-4">
			{/* Add comment */}
			<div className="flex gap-3">
				<AvatarIcon
					src={avatar_url ?? ""}
					fallback={getInitials(fullName)}
				/>

				<div className="flex-1 flex gap-2">
					<TextareaAutosize
						value={newComment}
						onChange={(e) => setNewComment(e.target.value)}
						placeholder="Write a comment..."
						className="flex-1 resize-none border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring bg-background"
						minRows={1}
						maxRows={4}
					/>

					<Button
						onClick={handleSubmit}
						disabled={!newComment.trim() || isLoading}
						size="icon"
						className="bg-gradient-primary text-primary-foreground hover:opacity-90"
					>
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Comments list */}
			<div className="space-y-3">
				{renderAllComments}
			</div>

			{/* Show more/less button */}
			{loadCount < postMessage.length && (
				<div
					ref={(el) => {
						if (el) {
							const observer = new IntersectionObserver(
								([entry]) => {
									if (entry.isIntersecting) {
										loadMoreComments();
									}
								},
								{ threshold: 0.1 }
							);
							observer.observe(el);
							return () => observer.disconnect();
						}
					}}
					className="h-10 flex items-center justify-center"
				>
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
				</div>
			)}
		</div>
	);
};