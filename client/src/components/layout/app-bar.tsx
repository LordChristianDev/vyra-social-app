import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useClerk } from '@clerk/clerk-react';
import { useQuery } from '@tanstack/react-query';
import { LogOut, Search } from "lucide-react";

import { useAuth } from '@/context/use-auth';
import { useProfile } from '@/context/use-profile';
import { useRoutes } from "@/hooks/use-routes";
import { createFullName, getInitials } from '@/lib/formatters';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { HoverIcon } from "@/components/common/hover-icon";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { NotificationsPopover } from '@/features/personalization/components/notifications/notifications-popover';

import type { ProfileProp } from '@/features/personalization/types/profile-types';
import { CONTROLLER } from '@/features/personalization/services/profile-services';

export const Appbar = () => {
	const { move } = useRoutes();
	const { toggleSidebar } = useSidebar();
	const { currentUser, signOut } = useAuth();
	const { signOut: clerkSignOut } = useClerk();
	const { storeProfile, clearProfile } = useProfile();

	const { data: profileData, isFetching: profileFetching } = useQuery({
		queryKey: ['appbar-profile', currentUser?.id],
		queryFn: async () => CONTROLLER.FetchProfileWithUserId(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
	});

	useEffect(() => {
		if (profileData && !profileFetching) {
			storeProfile(profileData);
		}
	}, [profileData, profileFetching]);

	const { first_name, last_name, avatar_url } = profileData ?? {} as ProfileProp;
	const fullName = createFullName(first_name, last_name);

	const handleLogout = async () => {
		await clerkSignOut();
		signOut();
		clearProfile();
		move('/');
	};

	return (
		<header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
			<div className='px-4 flex items-center justify-between gap-20 h-14 w-full'>
				{/* Logo */}
				<div className="flex items-center gap-3">
					<HoverIcon
						src="/vyra.png"
						className='w-16'
						toggle={toggleSidebar}
					/>
					<Link to="/home" className="flex items-center gap-2">
						<span className="font-satoshi font-bold text-xl">Vyra</span>
					</Link>
				</div>

				<div className="mx-auto flex items-end justify-end md:justify-between w-full">
					{/* Search */}
					<div className="hidden md:block flex-1 max-w-lg mx-4">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Search Vyra..."
								className="pl-10 bg-muted/50 border-0 focus:bg-background transition-smooth"
							/>
						</div>
					</div>

					<div className="flex items-end justify-end gap-5">
						<NotificationsPopover />

						{/* Avatar / Profile Dropdown */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<button className="h-8 w-8 ring-2 ring-primary/80 rounded-full cursor-pointer overflow-hidden">
									{profileFetching ? (
										< div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
									) : (
										<AvatarIcon
											src={avatar_url ?? ""}
											fallback={getInitials(fullName)}
											size='sm'
										/>
									)}
								</button>
							</DropdownMenuTrigger>

							<DropdownMenuContent align="end">
								<div className="py-2 px-4 flex items-center justify-start gap-3">
									{profileFetching ? (
										<div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
									) : (
										<AvatarIcon
											src={avatar_url ?? ""}
											fallback={getInitials(fullName)}
											size='sm'
											className='ring-2 ring-primary/80 rounded-full cursor-pointer'
										/>
									)}
									<div className="text-sm font-medium">
										{profileFetching ? "Loading..." : first_name}
									</div>
								</div>

								{/* View Profile */}
								{/* <DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => move('/profile')}>
									<div className='flex gap-2'>
										<User className="mr-2 h-4 w-4" />
										<span className='text-sm'>View Profile</span>
									</div>
								</DropdownMenuItem> */}

								{/* Logout */}
								<DropdownMenuSeparator />
								<DropdownMenuItem
									onClick={handleLogout}
									className="text-red-600"
								>
									<div className='flex gap-2'>
										<LogOut className="mr-2 h-4 w-4" />
										<span className='text-sm'>Log out</span>
									</div>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
		</header>
	);
};