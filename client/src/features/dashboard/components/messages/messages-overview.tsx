import { useEffect, useEffectEvent, useState } from "react";

import { ActiveChat } from "@/features/dashboard/components/messages/active-chat";
import { ConversationsCard } from "@/features/dashboard/components/messages/conversations-card";

import type { ConversationProp } from "@/features/dashboard/types/message_types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";

type MessagesOverviewProp = {
	profile: ProfileProp;
	conversations: ConversationProp[];
};

export const MessagesOverview = ({ profile, conversations }: MessagesOverviewProp) => {
	const [activeConversation, setActiveConversation] = useState<ConversationProp | null>(null);
	const [isMounted, setIsMounted] = useState(false);

	const onUpdate = useEffectEvent(() => {
		if (conversations && conversations.length > 0) {
			setActiveConversation(conversations[0]);
		}
		setIsMounted(true);
	});

	useEffect(() => {
		onUpdate();
	}, []);

	// Show loading spinner until mounted
	if (!isMounted) {
		return (
			<></>
		);
	}

	return (
		<div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-screen max-h-[calc(100vh-8rem)]">
			<div className="lg:col-span-1 space-y-4 h-full">
				{/* Conversations List */}
				<ConversationsCard
					profile={profile ?? {} as ProfileProp}
					conversations={conversations ?? []}
					activeConvo={activeConversation ?? null}
					setActiveConvo={setActiveConversation}
				/>
			</div>

			<div className="flex-1 lg:col-span-3 space-y-4 h-full">
				{/* Active Chat */}
				<ActiveChat
					profile={profile ?? {} as ProfileProp}
					activeConversation={activeConversation ?? {} as ConversationProp}
					conversationId={activeConversation?.id ?? 0}
				/>

				{!activeConversation &&
					<div className="mx-auto my-auto flex flex-col justify-center items-center h-full">
						<h2 className="text-3xl font-semibold">No Conversation</h2>
						<p className="text-sm text-muted-foreground">Please select or create a conversation</p>
					</div>
				}
			</div>
		</div>
	);
};