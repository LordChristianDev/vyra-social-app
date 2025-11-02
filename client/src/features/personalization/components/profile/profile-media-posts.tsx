import { useQuery } from "@tanstack/react-query";

import { DisplayPosts } from "@/features/dashboard/components/posts/display-posts";

import type { PostProp } from "@/features/dashboard/types/dashboard-types";
import {
	CONTROLLER as POST_CONTROLLER
} from "@/features/dashboard/services/post-services";

export const ProfileMediaPosts = ({ user_id }: { user_id: number }) => {

	const { data: postsData, isLoading: postsLoading } = useQuery({
		queryKey: ["profile-media-posts", user_id],
		queryFn: () => POST_CONTROLLER.FetchAllMediaPostsWithAuthorId(user_id),
		refetchOnMount: true,
		enabled: !!user_id,
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