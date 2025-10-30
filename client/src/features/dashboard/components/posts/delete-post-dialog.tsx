import { useState } from "react";

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

export type DeletePostDialogProp = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	post: PostProp;
}

export const DeletePostDialog = ({
	open,
	onOpenChange,
	// post
}: DeletePostDialogProp) => {
	const [isLoading, setIsLoading] = useState<boolean>(false);

	const handleDelete = async () => {
		setIsLoading(true);

		setTimeout(() => {
			setIsLoading(false);
			onOpenChange(false);
		}, 3000);
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