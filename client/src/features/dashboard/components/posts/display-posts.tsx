import { useCallback, useEffect, useState, useRef } from "react";

import { PostCard } from "@/features/dashboard/components/posts/post-card";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";

export const DisplayPosts = ({ posts }: { posts: PostProp[] }) => {
	const [visiblePosts, setVisiblePosts] = useState<PostProp[]>([]);
	const [loadCount, setLoadCount] = useState<number>(5);
	const observerRef = useRef<IntersectionObserver | null>(null);

	useEffect(() => {
		setVisiblePosts(posts.slice(0, loadCount));
	}, [posts, loadCount]);

	const loadMorePosts = useCallback(() => {
		setLoadCount(prev => Math.min(prev + 5, posts.length));
	}, [posts.length]);

	const lastPostRef = useCallback((node: HTMLDivElement | null) => {
		// Disconnect previous observer
		if (observerRef.current) {
			observerRef.current.disconnect();
		}

		// Create new observer
		if (node) {
			observerRef.current = new IntersectionObserver(
				([entry]) => {
					if (entry.isIntersecting) {
						loadMorePosts();
					}
				},
				{ threshold: 0.1 }
			);
			observerRef.current.observe(node);
		}
	}, [loadMorePosts]);

	const renderVisiblePosts = visiblePosts.map((post, index) => {
		return (
			<PostCard key={post.id || index} post={post} />
		);
	});

	return (
		<div>
			{renderVisiblePosts}
			{loadCount < posts.length && (
				<div
					ref={lastPostRef}
					className="h-10 flex items-center justify-center"
				>
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
				</div>
			)}
		</div>
	);
};