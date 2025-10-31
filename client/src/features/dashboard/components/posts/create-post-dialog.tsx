import { useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Image, Upload, X } from "lucide-react";
import TextareaAutosize from "react-textarea-autosize";

import { showToast } from "@/lib/show-toast";
import { createFullName, extractYouTubeId, getInitials } from "@/lib/formatters";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { MediaProp, ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as POST_CONTROLLER
} from "@/features/dashboard/services/post-services";
import { MultiSelectComboBox } from "@/components/ui/multi-combo-box";

type CreatePostDialogProp = {
	profile: ProfileProp;
	children: React.ReactNode;
}

export const CreatePostDialog = ({ profile, children }: CreatePostDialogProp) => {
	const { data: tagsData, isFetching: tagsFetching } = useQuery({
		queryKey: ["home-tags"],
		queryFn: () => POST_CONTROLLER.FetchTags(),
		enabled: true,
		refetchOnMount: true,
		staleTime: 0,
	});

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
	const queryClient = useQueryClient();

	const [content, setContent] = useState<string>('');
	const [uploads, setUploads] = useState<MediaProp[]>([]);
	const [selectedTags, setSelectedTags] = useState<string[]>([]);

	const { user_id, first_name, last_name, avatar_url } = profile;
	const fullName = createFullName(first_name, last_name);

	const inputRef = useRef<HTMLInputElement>(null);

	const maxImages = 10;
	const maxChars = 280;

	// Handle Images Selection
	const handleImagesSelection = (files: FileList | null) => {
		if (!files) return;

		const validFiles = Array.from(files).filter(file => {
			if (!file.type.startsWith('image/')) {
				showToast({
					title: "Invalid file type",
					description: "Only image files are allowed",
					variant: "warning",
				});
				return false;
			}

			// Check if less than 10MB limit
			if (file.size > 10 * 1024 * 1024) {
				showToast({
					title: "File too large",
					description: "Images must be smaller than 10MB",
					variant: "warning",
				});
				return false;
			}

			return true;
		});

		// Check if total images are more than 10
		if (uploads.length + validFiles.length > maxImages) {
			showToast({
				title: "Too many images",
				description: `You can only upload up to ${maxImages} images`,
				variant: "error",
			});
			return;
		}

		const newMediaItems: MediaProp[] = validFiles.map(file => ({
			id: Math.random().toString(36).substr(2, 9),
			file,
			url: URL.createObjectURL(file),
			type: file.type,
		}));

		setUploads(prev => [...prev, ...newMediaItems]);
	};

	// Handle Image Drop
	const handleImageDrop = (e: React.DragEvent) => {
		e.preventDefault();
		handleImagesSelection(e.dataTransfer.files);
	};

	// Handle Image Drag Over
	const handleImageDragOver = (e: React.DragEvent) => e.preventDefault();

	// Render Post Images
	const renderPostImages = uploads.map((item) => {
		const { id, url } = item;

		return (
			<div key={id} className="relative group">
				<img
					src={url}
					alt="Upload preview"
					className="w-full h-20 object-cover rounded-lg aspect-square"
				/>
				<Button
					variant="destructive"
					size="icon"
					className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
					onClick={() => removeImage(id ?? "")}
				>
					<X className="h-3 w-3" />
				</Button>
			</div>
		);
	})

	// Handle Remove Image
	const removeImage = (id: string) => {
		if (!id) return;

		setUploads(prev => {
			const item = prev.find(item => item.id === id);
			if (item) {
				URL.revokeObjectURL(item?.url ?? "");
			}
			return prev.filter(item => item.id !== id);
		});
	};

	// Handle Submit Post
	const handleSubmitPost = async () => {
		if (!content.trim() && content.length === 0) {
			showToast({
				title: "Empty post",
				description: "Please add some content to your post.",
				variant: "warning",
			});
			return;
		}
		setIsLoading(true);

		let values: Object = {};

		// Check Current Tags
		if (selectedTags.length > 0) {
			const setTags = selectedTags.map(tag => Number(tag));
			values = {
				...values,
				all_tags: setTags,
			}
		}

		// Check if Youtube URL Exist
		const youtubeId = extractYouTubeId(content);

		if (youtubeId) {
			values = {
				...values,
				youtube_embed: youtubeId,
			}
		}

		// Check if Images Exist
		if (uploads.length > 0) {
			const urls = await POST_CONTROLLER.UploadPostImages(user_id, uploads);
			values = {
				...values,
				images: urls,
			}
		}

		const response = await POST_CONTROLLER.CreateNewPost(
			user_id,
			content.trim(),
			values
		);

		if (!response) {
			showToast({
				title: "Creation Failed!",
				description: "Failed to create post.",
				variant: "error"
			});
			setIsLoading(false);
			setIsDialogOpen(false);
			setUploads([]);
			setContent("");
			return;
		}

		queryClient.invalidateQueries({ queryKey: ["home-posts"] });
		queryClient.invalidateQueries({ queryKey: ["settings-profile"] });

		showToast({
			title: "Post Created Successfully!",
			description: "Your post has been created.",
			variant: "success"
		});
		setIsLoading(false);
		setIsDialogOpen(false);
		setUploads([]);
		setContent("");
	};

	return (
		<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="max-w-3xl max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Create Post</DialogTitle>

					<DialogDescription>
						Share your thoughts and images with the community
					</DialogDescription>
				</DialogHeader>

				<div className="mt-4 space-y-4">
					<div className="flex gap-5">
						<AvatarIcon
							src={avatar_url ?? ''}
							fallback={getInitials(fullName)}
						/>

						<div className="flex-1">
							<TextareaAutosize
								value={content}
								onChange={(e) => setContent(e.target.value)}
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
						<span>{content.length}/{maxChars}</span>
						{content.length > maxChars * 0.8 && (
							<Badge variant={content.length > maxChars ? "destructive" : "secondary"}>
								{maxChars - content.length} left
							</Badge>
						)}
					</div>

					{tagsFetching ? (
						<div className="animate-pulse space-y-4">
							<div className="h-12 w-full bg-muted rounded" />
						</div>
					) : (
						<MultiSelectComboBox
							dataSource={(tagsData ?? []).map(tag => ({
								name: String(tag.id),
								label: tag.title,
							}))}
							title="Tags"
							value={selectedTags}
							onChange={(e) => setSelectedTags(e)}
							maxDisplay={3}
						/>
					)}

					{/* Media upload area */}
					<div
						onDrop={handleImageDrop}
						onDragOver={handleImageDragOver}
						className="p-4 border-2 border-dashed border-border rounded-lg text-center transition-smooth cursor-pointer"
						onClick={() => inputRef.current?.click()}
					>
						<Upload className="mb-2 mx-auto text-muted-foreground h-8 w-8" />
						<p className="text-sm text-muted-foreground">
							Drag & drop images here, or click to select
						</p>
						<p className="text-xs text-muted-foreground mt-1">
							Up to {maxImages} images, max 10MB each
						</p>
					</div>

					<input
						ref={inputRef}
						type="file"
						multiple
						accept="image/*"
						className="hidden"
						onChange={(e) => handleImagesSelection(e.target.files)}
					/>

					{/* Post Images Preview */}
					{uploads.length > 0 && (
						<div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto">
							{renderPostImages}
						</div>
					)}
					<Separator />

					{/* Actions */}
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Button
								variant="ghost"
								size="icon"
								onClick={() => inputRef.current?.click()}
								disabled={uploads.length >= maxImages}
							>
								<Image className="h-5 w-5" />
							</Button>
						</div>

						<Button
							onClick={handleSubmitPost}
							disabled={isLoading || content.length > maxChars}
							className="bg-gradient-primary text-primary-foreground cursor-pointer"
						>
							{isLoading ? "Posting..." : "Post"}
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};