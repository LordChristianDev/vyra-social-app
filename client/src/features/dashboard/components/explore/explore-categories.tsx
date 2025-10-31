import { Hash } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card, CardContent } from "@/components/ui/card";

import {
	CONTROLLER as POST_CONTROLLER
} from "@/features/dashboard/services/post-services";

export const ExploreCategories = () => {
	const { data: categoriesData, isFetching: categoriesFetching } = useQuery({
		queryKey: ["explore-categories"],
		queryFn: () => POST_CONTROLLER.FetchTrendingCategories(),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
		staleTime: 0,
	});

	const renderCategories = (categoriesData ?? []).map((category) => {
		const { id, title, popularity } = category;

		return (
			<Card key={id} className="group hover:shadow-medium transition-smooth shadow-soft cursor-pointer hover:scale-105">
				<CardContent className="p-4 text-center">
					<div className={"w-12 h-12 rounded-full bg-gradient-primary mx-auto mb-3 flex items-center justify-center"}>
						<Hash className="h-6 w-6 text-primary-foreground" />
					</div>
					<h3 className="font-semibold text-sm">{title}</h3>
					<p className="text-xs text-muted-foreground">{popularity} posts</p>
				</CardContent>
			</Card>
		);
	});
	return (
		categoriesFetching ? (
			<div className="animate-pulse space-y-4">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					<div className="h-48 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
					<div className="h-48 w-full bg-muted rounded" />
				</div>
			</div>
		) : (
			< div className="grid grid-cols-2 md:grid-cols-4 gap-6" >
				{renderCategories}
			</ div>
		)
	);
};