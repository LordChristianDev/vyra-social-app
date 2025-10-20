import { useRef, useState } from "react";
import { Camera } from "lucide-react";

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

import type { MediaProp } from "@/features/personalization/types/profile-types";

type UploadCoverDialogProp = {
	cover_url: string;
	children: React.ReactNode;
};

export const UploadCoverDialog = ({ cover_url, children }: UploadCoverDialogProp) => {
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [isUploading, setIsUploading] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const [upload, setUpload] = useState<MediaProp>({} as MediaProp);
	const inputRef = useRef<HTMLInputElement>(null);

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

	// Handle Save Cover
	const handleSave = async () => {
		if (!upload) return;

		setIsUploading(true);

		setTimeout(() => {
			setIsUploading(false);
			setIsDialogOpen(false);
		}, 1000);
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen} >
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="max-w-xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Upload Cover</DialogTitle>

					<DialogDescription>
						Upload a new cover photo
					</DialogDescription>
				</DialogHeader>

				<div className="mb-2 flex items-center justify-center"
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<div className="relative w-full h-48">
						<img
							src={upload?.url ?? cover_url}
							alt="Cover"
							className="object-cover w-full h-full rounded-xl"
						/>
						{isHovered &&
							<div className="absolute top-0 bg-black/25 rounded-xl w-full h-full cursor-pointer">
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
					className="flex bg-violet-600 hover:bg-violet-400 cursor-pointer">
					{isUploading
						? <span className="flex items-center">
							<svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
								<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
								<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
							</svg>
							<span className="p-18-semibold text-white">Saving...</span>
						</span>
						: <span className="p-18-semibold text-white">Set as Cover</span>}
				</Button>
			</DialogContent >
		</Dialog >
	);
};