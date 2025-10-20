import { ChevronRight, LogOut, Moon, Sun } from "lucide-react";

import { useAuth } from "@/context/use-auth";
import { useTheme } from "@/context/use-theme";
import { useProfile } from "@/context/use-profile";
import { useRoutes } from "@/hooks/use-routes";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
} from "@/components/ui/sidebar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger
} from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";

import type { AddtionalNavProp, NavigationProp } from "@/types/layout-types";
import { mainNavs, moreNavs } from "@/services/layout-services";

export const AppSidebar = () => {
	const { move } = useRoutes();
	const { signOut } = useAuth();
	const { clearProfile } = useProfile();
	const { isDarkMode, toggleTheme } = useTheme();

	const handleLogout = () => {
		signOut();
		clearProfile();
		move('/');
	};

	const renderNavs = (items: NavigationProp[]) => items.map((nav: NavigationProp, index) => {
		return <SidebarNav key={index} navigation={nav} />
	});

	return (
		<Sidebar variant="sidebar" collapsible="icon">
			<SidebarHeader className="flex items-center justify-between p-4 mb-5">
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Main</SidebarGroupLabel>

					<SidebarMenu>
						{renderNavs(mainNavs)}
					</SidebarMenu>
				</SidebarGroup>

				<SidebarGroup>
					<SidebarGroupLabel>Personalization</SidebarGroupLabel>

					<SidebarMenu>
						{renderNavs(moreNavs)}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<Separator />

				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={toggleTheme}
								tooltip="Theme"
								className="cursor-pointer"
							>
								{isDarkMode ?
									<Sun className="h-4 w-4" /> :
									<Moon className="h-4 w-4" />
								}
								<span>{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span>
							</SidebarMenuButton>
						</SidebarMenuItem>

						{/* Logout Button */}
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={handleLogout}
								tooltip="Theme"
								className="cursor-pointer"
							>
								<LogOut className="h-4 w-4 justify-start text-red-500 hover:text-red-700" />
								<span className="text-red-500 hover:text-red-700">Log out</span>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarFooter>
		</Sidebar>
	);
};

const SidebarNav = ({ navigation }: { navigation: NavigationProp }) => {
	const { isActiveRoute, move } = useRoutes();

	const { title, url, additionalNavs } = navigation;

	const hasSubNavs = additionalNavs && additionalNavs.length > 0;
	const handleOnClick = () => move(url);

	const renderAddtionalNavs = additionalNavs?.map((subNav: AddtionalNavProp) => {
		const { name, to } = subNav;
		const handleNavOnClick = () => move(to);

		return (
			<SidebarMenuButton
				key={name}
				isActive={isActiveRoute(to)}
				onClick={handleNavOnClick}
				className="cursor-pointer"
			>
				<div className="flex flex-row justify-between w-full">
					<div className="flex">
						<span>{name}</span>
					</div>
				</div>
			</SidebarMenuButton>
		);
	});


	return hasSubNavs ? (
		<Collapsible key={title} className="group/collapsible">
			<SidebarMenuItem>
				<CollapsibleTrigger asChild>
					<SidebarMenuButton
						tooltip={title}
						className="cursor-pointer"
					>
						<div className="flex flex-row justify-between w-full">
							<div className="flex">
								<navigation.icon className="h-4 w-4 mr-2" />
								<span>{title}</span>
							</div>

							<ChevronRight className="h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
						</div>
					</SidebarMenuButton>
				</CollapsibleTrigger>

				<CollapsibleContent>
					<SidebarMenuSub>
						{renderAddtionalNavs}
					</SidebarMenuSub>
				</CollapsibleContent>
			</SidebarMenuItem>
		</Collapsible>
	) : (
		<SidebarMenuItem key={title}>
			<SidebarMenuButton
				isActive={isActiveRoute(url)}
				onClick={handleOnClick}
				tooltip={title}
				className="cursor-pointer"
			>
				<div className="flex flex-row justify-between w-full">
					<div className="flex">
						<navigation.icon className="h-4 w-4 mr-2" />
						<span>{title}</span>
					</div>
				</div>
			</SidebarMenuButton>
		</SidebarMenuItem>
	);
}


