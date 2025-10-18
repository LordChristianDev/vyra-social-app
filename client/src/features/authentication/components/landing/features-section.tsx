import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

import { FeaturesItems } from "@/services/layout-services";

export const FeaturesSection = () => {
	const renderFeatures = FeaturesItems.map((feature, index) => {
		const { icon: Icon, title, description } = feature;

		return (
			<Card
				key={title}
				className="bg-[oklch(0.99_0.01_285)] border-0 group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 border-border/50 animate-fade-in"
				style={{ animationDelay: `${index * 0.1}s` }}
			>
				<CardContent className="p-6 space-y-4">
					<div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:animate-glow">
						<Icon className="w-6 h-6 text-gray-200" />
					</div>

					<div className="space-y-2">
						<h3 className="text-xl text-gray-800 font-semibold group-hover:text-primary transition-smooth">
							{title}
						</h3>

						<p className="text-muted-foreground leading-relaxed">
							{description}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	});

	return (
		<section className="py-20" id="explore">
			<div className="container mx-auto px-4 max-w-7xl">
				<div className="text-center space-y-4 mb-16">
					<Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
						Explore and Engage
					</Badge>

					<h2 className="text-4xl lg:text-5xl text-gray-900 font-bold leading-snug">
						Everything you need for
						<br />
						<span className="bg-gradient-to-r from-primary via-violet-400 to-primary bg-clip-text text-transparent animate-gradient bg-[length:100%_auto]">
							meaningful connections
						</span>
					</h2>

					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						Discover powerful features designed to enhance your social media experience
						while keeping your privacy and well-being at the center.
					</p>
				</div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
					{renderFeatures}
				</div>
			</div>
		</section>
	);
};