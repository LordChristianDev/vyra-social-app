import { cn } from "@/lib/utils";

export const ShowPostImages = ({ images, priority = false }: { images: string[]; priority?: boolean }) => {
	const imageCount = images.length;
	const imagesToShow = imageCount > 4 ? images.slice(0, 4) : images;
	const remainingCount = imageCount - 4;

	if (!imageCount) return null;

	return (
		<div className={cn(
			"mb-3 grid gap-2",
			imageCount >= 4 || imageCount === 2
				? "grid-cols-2"
				: imageCount === 3
					? "grid-cols-3"
					: "grid-cols-1"
		)}>
			{imagesToShow.map((image, index) => (
				<div key={index} className="relative rounded-lg overflow-hidden bg-gray-200">
					<img
						src={image}
						alt={`Post ${index + 1}`}
						className="w-full aspect-video object-cover"
						loading={priority && index === 0 ? "eager" : "lazy"}
						fetchPriority={priority && index === 0 ? "high" : "auto"}
					/>
					{remainingCount > 0 && index === 3 && (
						<div className="absolute inset-0 bg-black/60 flex items-center justify-center">
							<span className="text-white font-bold">+{remainingCount}</span>
						</div>
					)}
				</div>
			))}
		</div>
	);
};