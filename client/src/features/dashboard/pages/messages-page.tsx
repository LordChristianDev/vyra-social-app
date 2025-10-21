import { useEffectEvent, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import { useProfile } from "@/context/use-profile";

import { MessagesOverview } from "@/features/dashboard/components/messages/messages-overview";

import type { ConversationProp } from "@/features/dashboard/types/message_types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { QUERIES as MESSAGE_QUERIES } from "@/features/dashboard/services/message-services";
import { QUERIES as PROFILE_QUERIES } from "@/features/personalization/services/profile-services";

export default function MessagesPage() {
	return (
		<MessagesContent />
	);
};

const MessagesContent = () => {
	const { storeProfile } = useProfile();

	const { data: profileData, isFetching: profileFetching } = useQuery({
		queryKey: ["messages-profile"],
		queryFn: () => PROFILE_QUERIES.fetchProfileWithUserId(1),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
		staleTime: 0,
	});

	const { data: conversationData, isFetching: conversationsFetching } = useQuery({
		queryKey: ["all-conversations"],
		queryFn: () => MESSAGE_QUERIES.fetchConversationsByProfileId(1),
		enabled: (query) => !query.state.data,
		refetchOnMount: true,
		staleTime: 0,
	});

	const onFetch = useEffectEvent(() => {
		if (profileData && !profileFetching) {
			storeProfile(profileData);
		}
	});

	useEffect(() => {
		onFetch();
	}, []);

	return (
		<main className="flex-1 pt-8 px-8 mx-auto w-full">
			{profileFetching || conversationsFetching ? (
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