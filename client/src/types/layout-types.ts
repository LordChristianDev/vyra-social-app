import type { LucideIcon } from "lucide-react";

export type AppbarNavProps = {
	title: string;
	href: string;
};

export type AddtionalNavProp = {
	name: string;
	to: string;
};

export type NavigationProp = {
	title: string;
	url: string;
	icon: LucideIcon;
	description?: string;
	additionalNavs?: AddtionalNavProp[];
};

