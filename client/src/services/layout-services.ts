import {
	Compass, LayoutDashboard, Settings, User,
	Users, MessageCircle, Heart, Sparkles, Shield, Zap,
	type LucideIcon
} from "lucide-react";
import { } from "lucide-react";

import type { AppbarNavProps, NavigationProp } from "@/types/layout-types";

export const AppbarNavItems: AppbarNavProps[] = [
	{ title: "Explore", href: "explore" },
	{ title: "Engage", href: "explore" },
	{ title: "Connect", href: "connect" },
];

export const StatsItems: { number: string; label: string }[] = [
	{ number: "10K+", label: "Active Users" },
	{ number: "1M+", label: "Posts Shared" },
	{ number: "5M+", label: "Connections Made" },
	{ number: "99.9%", label: "Uptime" }
];

export const FeaturesItems: { icon: LucideIcon; title: string; description: string }[] = [
	{
		icon: Users,
		title: "Connect",
		description: "Build meaningful relationships with people who share your interests and passions."
	},
	{
		icon: MessageCircle,
		title: "Share",
		description: "Express yourself through posts, images, and videos in a beautiful, intuitive interface."
	},
	{
		icon: Heart,
		title: "Discover",
		description: "Find amazing content and creators through our intelligent recommendation system."
	},
	{
		icon: Shield,
		title: "Privacy First",
		description: "Your data is yours. We prioritize privacy and give you full control over your content."
	},
	{
		icon: Zap,
		title: "Lightning Fast",
		description: "Experience seamless interactions with our optimized, lightning-fast platform."
	},
	{
		icon: Sparkles,
		title: "Beautiful Design",
		description: "Enjoy a clean, modern interface that puts your content front and center."
	}
];

export const mainNavs: NavigationProp[] = [
	{
		title: "Home",
		url: "/home",
		icon: LayoutDashboard,
		description: "Recents Posts and Activities"
	},
	{
		title: "Explore",
		url: "/explore",
		icon: Compass,
		description: "Explore the platform",
		// additionalNavs: [
		// 	{
		// 		name: "Add Case",
		// 		to: "/add-case"
		// 	},
		// 	{
		// 		name: "View Cases",
		// 		to: "/view-cases"
		// 	},
		// ]
	},
	{
		title: "Messages",
		url: "/messages",
		icon: MessageCircle,
		description: "All messages"
	},
];

export const moreNavs: NavigationProp[] = [
	{
		title: "Profile",
		url: "/profile",
		icon: User,
		description: "Personal information"
	},
	{
		title: "Settings",
		url: "/settings",
		icon: Settings,
		description: "App preferences"
	}
];