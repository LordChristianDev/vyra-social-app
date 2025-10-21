import { useRef, useState } from 'react';

type PostImage = {
	id: string;
	url: string;
};

export const usePostHandler = () => {
	const [isCreatePostDialogOpen, setIsCreatePostDialogOpen] = useState(false);
	const [postContent, setPostContent] = useState('');
	const [isPosting, setIsPosting] = useState(false);
	const [postImages, setPostImages] = useState<PostImage[]>([]);
	const postInputRef = useRef<HTMLInputElement>(null);

	const maxImages = 5;
	const maxChars = 500;

	const handleImagesSelection = (files: FileList | null) => {
		if (!files) return;

		const remainingSlots = maxImages - postImages.length;

		for (let i = 0; i < Math.min(files.length, remainingSlots); i++) {
			const file = files[i];
			const reader = new FileReader();

			reader.onload = (e) => {
				const result = (e.target as FileReader)?.result;
				if (result) {
					setPostImages((prev) => [
						...prev,
						{
							id: `${Date.now()}-${i}`,
							url: result as string,
						},
					]);
				}
			};

			reader.readAsDataURL(file);
		}
	};

	const handleImageDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		handleImagesSelection(e.dataTransfer.files);
	};

	const handleImageDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
	};

	const removeImage = (id: string) => {
		setPostImages((prev) => prev.filter((img) => img.id !== id));
	};

	const handleSubmitPost = async () => {
		if (!postContent.trim()) return;

		setIsPosting(true);
		try {
			// TODO: Implement post submission logic
			console.log('Submitting post:', { postContent, postImages });
			// Reset form after successful submission
			setPostContent('');
			setPostImages([]);
			setIsCreatePostDialogOpen(false);
		} catch (error) {
			console.error('Error submitting post:', error);
		} finally {
			setIsPosting(false);
		}
	};

	return {
		isCreatePostDialogOpen,
		setIsCreatePostDialogOpen,
		postContent,
		setPostContent,
		isPosting,
		postImages,
		postInputRef,
		maxImages,
		maxChars,
		handleImagesSelection,
		handleImageDrop,
		handleImageDragOver,
		removeImage,
		handleSubmitPost,
	};
};