import { StatsItems } from "@/services/layout-services";

export const StatsSection = () => {
	const renderStats = StatsItems.map((stat, index) => {
		const { number, label } = stat;

		return (
			<div key={index} className="text-center space-y-2 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
				<div className="text-3xl lg:text-4xl font-bold text-gray-200">
					{number}
				</div>
				<div className="text-gray-300 text-sm lg:text-base">
					{label}
				</div>
			</div>
		);
	});

	return (
		<section className="py-12 bg-card/50 bg-gradient-primary backdrop-blur-sm">
			<div className="container mx-auto px-4">
				<div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
					{renderStats}
				</div>
			</div>
		</section>
	);
};