import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";

import { getItem } from "@/lib/local-storage";
import { useRoutes } from "@/hooks/use-routes";

import { Navbar } from "@/features/authentication/components/landing/navbar";
import { HeroSection } from "@/features/authentication/components/landing/hero-section";
import { StatsSection } from "@/features/authentication/components/landing/stats-section";
import { FeaturesSection } from "@/features/authentication/components/landing/features-section";
import { CTASection } from "@/features/authentication/components/landing/cta-section";
import { FooterSection } from "@/features/authentication/components/landing/footer-section";

export default function LandingPage() {
	const { move } = useRoutes();
	const { isSignedIn } = useUser();
	const isLoggedIn = !!getItem('currentUser');

	useEffect(() => {
		if (isLoggedIn) {
			move("/home");
			return;
		}

		if (isSignedIn) {
			move("/login");
			return;
		}
	}, [isLoggedIn, isSignedIn]);

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