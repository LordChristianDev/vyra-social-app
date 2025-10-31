import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { showToast } from "@/lib/show-toast";

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle
} from "@/components/ui/alert-dialog";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import { CONTROLLER as POST_CONTROLLER } from "@/features/dashboard/services/post-services";

export type DeletePostDialogProp = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	post: PostProp;
}

export const DeletePostDialog = ({
	open,
	onOpenChange,
	post
}: DeletePostDialogProp) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const handleDelete = async () => {
		if (!post.id) throw new Error("No Unique Identifier!");
		setIsLoading(true);

		const response = await POST_CONTROLLER.DeletePostWithId(post.id)

		if (!response) {
			showToast({
				title: "Deletion Failed!",
				description: "Failed to delete post.",
				variant: "error"
			});
			setIsLoading(false);
			onOpenChange(false);
			return;
		}

		showToast({
			title: "Post Deleted Successfully!",
			description: "Your post has been deleted.",
			variant: "success"
		});

		setIsLoading(false);
		onOpenChange(false);

		queryClient.invalidateQueries({ queryKey: ["home-posts"] });
		queryClient.invalidateQueries({ queryKey: ["settings-profile"] });
	}

	return (
		<AlertDialog open={open} onOpenChange={onOpenChange}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete Post</AlertDialogTitle>

					<AlertDialogDescription>
						Are you sure you want to delete this post? This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>

				<AlertDialogFooter>
					<AlertDialogCancel disabled={isLoading}>
						Cancel
					</AlertDialogCancel>

					<AlertDialogAction
						onClick={handleDelete}
						disabled={isLoading}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{isLoading ? "Deleting..." : "Delete"}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};