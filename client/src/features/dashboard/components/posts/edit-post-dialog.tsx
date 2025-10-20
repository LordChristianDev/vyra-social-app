import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";

import { showToast } from "@/lib/show-toast";
import { createFullName, getInitials } from "@/lib/formatters";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";

type EditPostDialogProp = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	post: PostProp;
};

export const EditPostDialog = ({ open, onOpenChange, post }: EditPostDialogProp) => {
	const {
		content,
		author: { first_name, last_name, avatar_url }
	} = post;

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [postContent, setPostContent] = useState<string>(content);

	const maxChars: number = 250;
	const fullName: string = createFullName(first_name, last_name);

	// Update
	const handleEdit = async () => {
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			onOpenChange(false);
			setPostContent("");

			showToast({
				title: "Successfully Updated Post",
				description: "Your post has been updated!",
				variant: "success"
			});

		}, 3000);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-3xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Edit Post</DialogTitle>

					<DialogDescription>
						Expand your thoughts with the community
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 space-y-4">
					<div className="flex gap-5">
						<AvatarIcon
							src={avatar_url ?? ""}
							fallback={getInitials(fullName)}
						/>

						<div className="flex-1">
							<TextareaAutosize
								value={postContent}
								onChange={(e) => setPostContent(e.target.value)}
								placeholder="What's on your mind?"
								className="text-md placeholder:text-muted-foreground bg-transparent w-full focus:outline-none border-none"
								minRows={3}
								maxRows={10}
								maxLength={maxChars}
							/>
						</div>
					</div>

					{/* Character count */}
					<div className="flex justify-between items-center text-sm text-muted-foreground">
						<span>{postContent.length}/{maxChars}</span>
						{postContent.length > maxChars * 0.8 && (
							<Badge variant={postContent.length > maxChars ? "destructive" : "secondary"}>
								{maxChars - postContent.length} left
							</Badge>
						)}
					</div>

					{/* Actions */}
					<div className="flex justify-end gap-2">
						<Button
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isLoading}
						>
							Cancel
						</Button>
						<Button
							onClick={handleEdit}
							disabled={isLoading || postContent.length > maxChars || !postContent.trim()}
							className="bg-gradient-primary text-primary-foreground hover:opacity-90"
						>
							{isLoading ? "Updating..." : "Update Post"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};