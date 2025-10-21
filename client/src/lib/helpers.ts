// -- Extract YouTube Video ID
export const extractYouTubeId = (content: string) => {
	if (!content) return null;

	const pattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
	const match = content.match(pattern);

	return match ? match[1] : null;
};