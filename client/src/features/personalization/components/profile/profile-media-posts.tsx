import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";

import { DisplayPosts } from "@/features/dashboard/components/posts/display-posts";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import {
	CONTROLLER as POST_CONTROLLER
} from "@/features/dashboard/services/post-services";

export const ProfileMediaPosts = () => {
	const { currentUser } = useAuth();

	const { data: postsData, isLoading: postsLoading } = useQuery({
		queryKey: ["profile-media-posts", currentUser?.id],
		queryFn: () => POST_CONTROLLER.FetchAllMediaPostsWithAuthorId(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	return (
		<div>
			{postsLoading ? (
				<div className="animate-pulse space-y-4">
					<div className="h-48 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
				</div>
			) : (
				<>
					{postsData && postsData.length > 0 ? (
						<DisplayPosts posts={postsData as PostProp[]} />
					) : (
						<div className="text-center py-12">
							<p className="text-muted-foreground">No media posts to show</p>
						</div>
					)}
				</>
			)}
		</div>
	);

};