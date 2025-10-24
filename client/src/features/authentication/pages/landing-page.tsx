import { Navbar } from "@/features/authentication/components/landing/navbar";
import { HeroSection } from "@/features/authentication/components/landing/hero-section";
import { StatsSection } from "@/features/authentication/components/landing/stats-section";
import { FeaturesSection } from "@/features/authentication/components/landing/features-section";
import { CTASection } from "@/features/authentication/components/landing/cta-section";
import { FooterSection } from "@/features/authentication/components/landing/footer-section";

export default function LandingPage() {
	return (
		<div className="min-h-screen bg-white">
			{/* Hero Section */}
			<section className="relative overflow-hidden">
				<Navbar />

				<HeroSection />
			</section>

			{/* Stats Section */}
			<StatsSection />

			{/* Features Section */}
			<FeaturesSection />

			{/* CTA Section */}
			<CTASection />

			{/* Footer */}
			<FooterSection />
		</div >
	);
};