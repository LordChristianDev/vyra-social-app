import { useEffect, useEffectEvent, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Search } from "lucide-react";

import { useAuth } from "@/context/use-auth";
import { useProfile } from "@/context/use-profile";
import { cn } from "@/lib/utils";
import { showToast } from "@/lib/show-toast";
import { createFullName, getInitials } from "@/lib/formatters";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { LoadingHud } from "@/components/common/loading-hud";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as MESSAGE_CONTROLLER
} from "@/features/dashboard/services/message-services";

type StartConversationDialogProp = {
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export const StartConversationDialog = ({
	open,
	onOpenChange,
}: StartConversationDialogProp) => {
	const queryClient = useQueryClient();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [search, setSearch] = useState<string>("")
	const [profiles, setProfiles] = useState<ProfileProp[]>([]);

	const { currentUser } = useAuth();
	const { filterProfiles } = useProfile();

	const { data: profilesData, isFetching: profilesFetching } = useQuery({
		queryKey: ["start-conversation-profiles", currentUser?.id],
		queryFn: () => MESSAGE_CONTROLLER.FetchStartConvoProfiles(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	const onUpdated = useEffectEvent(() => {
		if (profilesData && !profilesFetching) {
			setProfiles(profilesData);
		}
	});

	useEffect(() => {
		onUpdated();
	}, [profilesData, profilesFetching]);

	useEffect(() => {
		if (search.trim() == "") {
			if (profilesData) {
				setProfiles(profilesData);
			}
		} else {
			if (profilesData) {
				setProfiles(filterProfiles(profilesData, search));
			}
		}
	}, [profilesData, search]);

	const renderProfiles = profiles.map((profile) => {
		const { first_name, last_name, username, avatar_url, user_id } = profile;

		const fullName = createFullName(first_name, last_name);

		const handleCreateNewConvo = async () => {
			if (!user_id) throw new Error("No Unique Identifer Found");
			if (!currentUser?.id) throw new Error("No Unique Identifer Found");

			setIsLoading(true);

			const response = await MESSAGE_CONTROLLER.CreateNewConversation(user_id, currentUser.id);

			if (!response) {
				showToast({
					title: "Creation Failed",
					description: "Failed to create new conversation",
					variant: "error"
				});

				setIsLoading(false);
				onOpenChange(false);
				return;
			}

			queryClient.invalidateQueries({ queryKey: ["messages-conversations"] });
			queryClient.invalidateQueries({ queryKey: ["start-conversation-profiles"] });

			showToast({
				title: "Conversation Created",
				description: "You have successfully created a new conversation",
				variant: "success"
			});

			setIsLoading(false);
			onOpenChange(false);
		}

		return (
			<div
				key={first_name + last_name + user_id}
				className={cn(
					"mx-auto p-4 group flex flex-row items-center gap-4 rounded-xl cursor-pointer transition-smooth border-2 overflow-hidden",
					"hover:bg-accent/30 border-transparent hover:border-accent/50"
				)}
				onClick={() => handleCreateNewConvo()}
			>
				<div className="relative shrink-0">
					<AvatarIcon
						src={avatar_url ?? ''}
						fallback={getInitials(fullName)}
						className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-smooth"
					/>
				</div>

				<div className="flex-1 min-w-0 overflow-hidden">
					<div className="flex items-center justify-between gap-2 w-full">
						<p className="font-base text-foreground group-hover:text-primary transition-smooth flex-1 min-w-0 truncate">
							{fullName}
						</p>
					</div>
					<p className="text-sm text-muted-foreground flex-1 min-w-0 truncate">
						@{username}
					</p>
				</div>
			</div >
		);
	});

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-lg max-h-[90vh]">
				<DialogHeader>
					<DialogTitle>Start Chat</DialogTitle>

					<DialogDescription>
						Talk to someone new
					</DialogDescription>
				</DialogHeader>
				{profilesFetching ? (
					<div className="animate-pulse space-y-4">
						<div className="h-12 w-full bg-muted rounded" />
						<div className="h-16 w-full bg-muted rounded" />
						<div className="h-16 w-full bg-muted rounded" />
						<div className="h-16 w-full bg-muted rounded" />
					</div>
				) : (
					<div className="space-y-4">
						<div className="mb-4 relative group">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-smooth" />
							<Input
								placeholder="Search names..."
								defaultValue={search}
								onChange={(e) => setSearch(e.target.value)}
								className="pl-12 bg-background/80 border-2 border-muted h-12  focus:border-primary rounded-xl shadow-sm transition-smooth"
							/>
						</div>
						<div className="space-y-2">
							{profiles && profiles.length > 0 ? (
								(renderProfiles)
							) : (
								<div className="mx-auto my-auto py-4 flex flex-col justify-center items-center h-full">
									<h2 className="text-2xl font-semibold ">Start Chatting</h2>
									<p className="text-sm text-muted-foreground">Create a fun conversation</p>
								</div>
							)}
						</div>
					</div>
				)}
				<LoadingHud isOpen={isLoading} message="Please wait..." />
			</DialogContent >
		</Dialog >
	);
};