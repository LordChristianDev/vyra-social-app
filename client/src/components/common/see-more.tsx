import { useState } from "react";

type SeeMoreProps = {
	text: string;
	maxLength?: number;
	className?: string;
	moreText?: string;
	lessText?: string;
}

export const SeeMore = ({
	text,
	maxLength = 100,
	className = "text-sm text-muted-foreground",
	moreText = "See more",
	lessText = "See less"
}: SeeMoreProps) => {
	const [isExpanded, setIsExpanded] = useState(false)

	// If text is shorter than maxLength, just return the text
	if (!text || text.length <= maxLength) {
		return <p className={className}>{text}</p>
	}

	const truncatedText = text.slice(0, maxLength).trim()

	return (
		<p className={className}>
			{isExpanded ? text : `${truncatedText}...`}
			{' '}
			<button
				onClick={() => setIsExpanded(!isExpanded)}
				className="text-violet-500 hover:text-violet-600 font-medium cursor-pointer underline-offset-2 hover:underline"
			>
				{isExpanded ? lessText : moreText}
			</button>
		</p>
	);
}