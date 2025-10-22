import { Sparkles } from "lucide-react";

import { EnhancedSearch } from "@/features/dashboard/components/explore/enhanced-search";
import { TrendingTopics } from "@/features/dashboard/components/additional/trending-topics";
import { ExploreCategories } from "@/features/dashboard/components/explore/explore-categories";
import { SuggestedProfiles } from "@/features/dashboard/components/additional/suggested-profiles";

export const ExploreOverview = () => {
	return (
		<main className="p-8 mx-auto w-full animate-fade-in">
			{/* Enhanced Search */}
			<EnhancedSearch />

			{/* Categories */}
			<div className="mb-6">
				<h2 className="mb-4 items-center gap-2 text-xl font-semibold flex">
					<Sparkles className="h-5 w-5 text-primary" />
					Popular Categories
				</h2>
				<ExploreCategories />

			</div>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Main Content */}
				<div className="lg:col-span-2 space-y-4">
					{/* Trending Topics */}
					<TrendingTopics />
				</div>

				{/* Enhanced Sidebar */}
				<div className="lg:col-span-1 space-y-4">
					{/* Suggested Users */}
					<SuggestedProfiles />
				</div>
			</div>
		</main>
	);
};