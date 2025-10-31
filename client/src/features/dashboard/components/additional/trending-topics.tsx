import { useQuery } from "@tanstack/react-query";
import { Hash, TrendingUp } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { CONTROLLER as POST_CONTROLLER } from "@/features/dashboard/services/post-services";
import type { TagProp } from "@/features/dashboard/types/dashboard-types";

export const TrendingTopics = () => {
	const { data: tagsData, isFetching: tagsFetching } = useQuery({
		queryKey: ["trending-topics"],
		queryFn: () => POST_CONTROLLER.FetchTrendingTags(),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
		staleTime: 0,
	});

	const renderTrendingTopics = (tagsData ?? []).map((topic, index) => {
		const { id, title, popularity, category: { title: trending } } = topic as TagProp;

		return (
			<div key={id} className="p-3 rounded-lg hover:bg-accent/50 transition-smooth cursor-pointer group">
				<div className="flex items-start justify-between">
					<div className="flex-1">
						<p className="text-sm text-muted-foreground mb-1">Trending in {trending}</p>

						<p className="font-semibold text-foreground group-hover:text-primary transition-smooth flex items-center gap-1">
							<Hash className="h-3 w-3" />
							{title}
						</p>

						<p className="text-sm text-muted-foreground mt-1">{popularity}</p>
					</div>

					<div className="text-sm font-medium text-primary">#{index + 1}</div>
				</div>
			</div>
		);
	})

	return (
		tagsFetching ? (
			<div className="animate-pulse space-y-4">
				<div className="h-72 w-full bg-muted rounded" />
			</div>
		) : (
			(tagsData && tagsData.length > 0 && <Card className="shadow-soft border-border/50">
				< CardHeader >
					<CardTitle className="text-lg font-semibold flex items-center gap-4">
						<TrendingUp className="h-5 w-5 text-primary" />
						What's happening
					</CardTitle >
				</ CardHeader>

				<CardContent className="space-y-2">
					{renderTrendingTopics}
				</CardContent>
			</Card>)
		)
	);
};