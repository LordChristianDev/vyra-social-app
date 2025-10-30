import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { showToast } from "@/lib/show-toast";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { MediaProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

type UploadAvatarDialog = {
	avatar_url: string;
	children: React.ReactNode;
}

export const UploadAvatarDialog = ({ avatar_url, children }: UploadAvatarDialog) => {
	const [isHovered, setIsHovered] = useState(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const [upload, setUpload] = useState<MediaProp>({} as MediaProp);
	const inputRef = useRef<HTMLInputElement>(null);

	const { currentUser } = useAuth();
	const queryClient = useQueryClient();

	// Handle Cover Upload
	const handleUpload = (image: File | null) => {
		if (!image) return;

		// Check Type
		if (!image.type.startsWith('image/')) {
			showToast({
				title: "Invalid file type",
				description: "Only image files are allowed",
				variant: "warning",
			});
			return;
		}

		// Check if less than 15MB limit
		if (image.size > 15 * 1024 * 1024) {
			showToast({
				title: "File too large",
				description: "Images must be smaller than 10MB",
				variant: "warning",
			});
			return;
		}

		setUpload({
			id: Math.random().toString(36).substring(2, 9),
			file: image,
			url: URL.createObjectURL(image),
			type: image.type,
		});
	};

	// Handle Save Avatar
	const handleSave = async () => {
		if (!upload?.file) {
			showToast({
				title: "File is empty!",
				description: "Unable to complete upload without uploaded file",
				variant: "error"
			});
			return;
		}

		if (!currentUser?.id) {
			showToast({
				title: "Something went wrong!",
				description: "Unable to complete upload without identifier",
				variant: "error"
			});
			return;
		}

		setIsUploading(true);

		const response = await PROFILE_CONTROLLER.UpdateAvatarWithUserId(
			currentUser.id,
			upload
		);

		if (!response) {
			showToast({
				title: "Update Failed!",
				description: "Failed to update profile avatar.",
				variant: "error"
			});
			setIsUploading(false);
			return;
		}

		showToast({
			title: "Updated Profile Avatar!",
			description: "Successfully updated profile avatar.",
			variant: "success"
		});

		setIsUploading(false);
		setIsDialogOpen(false);
		queryClient.invalidateQueries({ queryKey: ["profile-profile", currentUser?.id] });
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="max-w-sm max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Upload Avatar</DialogTitle>

					<DialogDescription>
						Upload a new profile picture
					</DialogDescription>
				</DialogHeader>

				<div className="p-4 flex items-center justify-center"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<div className="relative w-24 h-24">
						<AvatarIcon
							src={upload?.url ?? avatar_url ?? ""}
							fallback="NW"
							size="3xl"
						/>

						{isHovered &&
							<div className="absolute top-0 bg-black/25 rounded-full w-full h-full cursor-pointer">
								<a
									onClick={() => inputRef.current?.click()}
									className="flex items-center justify-center text-white h-full"
								>
									<Camera className="h-8 w-8" />
								</a>
							</div>}
					</div>
				</div>

				<input
					ref={inputRef}
					type="file"
					multiple
					accept="image/*"
					className="hidden"
					onChange={(e) => handleUpload(e.target.files?.[0] || null)}
				/>

				<Button
					type="submit"
					onClick={handleSave}
					disabled={isUploading}
					className="flex bg-violet-600 hover:bg-violet-400 cursor-pointer">
					{isUploading
						? <span className="flex items-center">
							<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span className="p-18-semibold text-white">Saving...</span>
						</span>
						: <span className="p-18-semibold text-white">Set as Profile</span>}
				</Button>
			</DialogContent>
		</Dialog>
	);
}


