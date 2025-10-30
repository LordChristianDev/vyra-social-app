import { useEffect } from "react";
import { useClerk, useUser } from "@clerk/clerk-react";

import { useAuth } from "@/context/use-auth";
import { useRoutes } from "@/hooks/use-routes";
import { getItem } from "@/lib/local-storage";

import { Navbar } from "@/features/authentication/components/landing/navbar";
import { HeroSection } from "@/features/authentication/components/landing/hero-section";
import { StatsSection } from "@/features/authentication/components/landing/stats-section";
import { FeaturesSection } from "@/features/authentication/components/landing/features-section";
import { CTASection } from "@/features/authentication/components/landing/cta-section";
import { FooterSection } from "@/features/authentication/components/landing/footer-section";

export default function LandingPage() {
	const { move } = useRoutes();
	const { signOut } = useAuth();
	const { isSignedIn } = useUser();
	const { signOut: clerkSignOut } = useClerk();

	const isLoggedIn = !!getItem('currentUser');

	useEffect(() => {
		// Do nothing until Clerk has finished loading
		if (typeof isSignedIn === "undefined" || typeof isLoggedIn === "undefined") return;

		// If the user is signed in with Clerk but not yet logged in your app → go to login page
		if (isSignedIn && !isLoggedIn) {
			move("/login");
			return;
		}

		// If user is fully logged in → go home
		if (isLoggedIn) {
			move("/home");
			return;
		}

		// If Clerk finished loading and user is definitely not signed in → sign out cleanly
		if (!isSignedIn && !isLoggedIn) {
			console.log("User not signed in, clearing sessions");
			signOut();
			clerkSignOut();
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