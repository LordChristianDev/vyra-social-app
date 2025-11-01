import { useEffectEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/use-auth";
import { useProfile } from "@/context/use-profile";

import { MessagesOverview } from "@/features/dashboard/components/messages/messages-overview";

import type { ConversationProp } from "@/features/dashboard/types/message_types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import {
	CONTROLLER as MESSAGE_CONTROLLER
} from "@/features/dashboard/services/message-services";
import {
	CONTROLLER as PROFILE_CONTROLLER
} from "@/features/personalization/services/profile-services";

export default function MessagesPage() {
	return (
		<MessagesContent />
	);
};

const MessagesContent = () => {
	const { currentUser } = useAuth();
	const { storeProfile } = useProfile();

	const { data: profileData, isLoading: profileLoading } = useQuery({
		queryKey: ["messages-profile", currentUser?.id],
		queryFn: () => PROFILE_CONTROLLER.FetchProfileWithUserId(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	const { data: conversationData, isLoading: conversationsLoading } = useQuery({
		queryKey: ["messages-conversations", currentUser?.id],
		queryFn: () => MESSAGE_CONTROLLER.FetchAllConversationWithProfileId(currentUser?.id ?? 0),
		enabled: !!currentUser?.id,
		refetchOnMount: true,
		staleTime: 0,
	});

	const onFetch = useEffectEvent(() => {
		if (profileData && !profileLoading) {
			storeProfile(profileData);
		}
	});

	useEffect(() => {
		onFetch();
	}, []);

	return (
		<main className="flex-1 pt-8 px-8 mx-auto w-full">
			{profileLoading || conversationsLoading ? (
				<div className="animate-pulse space-y-4">
					<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen max-h-[calc(100vh-8rem)]">
						<div className="lg:col-span-1 space-y-4">
							<div className="h-full w-full bg-muted rounded" />
						</div>

						<div className="lg:col-span-3 space-y-4">
							<div className="h-full w-full bg-muted rounded" />
						</div>
					</div>
				</div>
			) : (
				<MessagesOverview
					profile={profileData as ProfileProp}
					conversations={conversationData as ConversationProp[]}
				/>
			)}
		</main >
	);
};