import { useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const EnhancedSearch = () => {
	const [search, setSearch] = useState<string>("");

	return (
		<Card className="mb-8 shadow-soft border-0 bg-gradient-to-r from-card/50 to-card backdrop-blur-sm">
			<CardContent>
				<div className="relative group">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-smooth" />
					<Input
						placeholder="Search for topics, people, or posts..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-12 text-md bg-background/80 border-2 border-muted shadow-sm focus:border-primary rounded-xl  transition-smooth h-14"
					/>
				</div>
			</CardContent>
		</Card>
	);
};