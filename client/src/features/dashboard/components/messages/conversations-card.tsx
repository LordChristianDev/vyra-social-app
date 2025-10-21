import { useEffect, useEffectEvent, useState } from "react";
import { Search, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { createFullName, getInitials, timeAgo } from "@/lib/formatters";

import {
	Card,
	CardContent,
	CardHeader,
	CardTitle
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarIcon } from "@/components/common/avatar-icon";
import { StartConversationDialog } from "@/features/dashboard/components/messages/start-conversation-dialog";

import type { ProfileProp } from "@/features/personalization/types/profile-types";
import type { ConversationProp, MessageProp } from "@/features/dashboard/types/message_types";
import { useChat } from "../../hooks/use-chat";

type ConversationsCardProp = {
	profile: ProfileProp;
	conversations: ConversationProp[];
	activeConvo: ConversationProp | null;
	setActiveConvo: (active: ConversationProp) => void;
};

export const ConversationsCard = ({
	profile,
	conversations,
	activeConvo,
	setActiveConvo,
}: ConversationsCardProp) => {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

	const [convos, setConvos] = useState<ConversationProp[]>([]);
	const [search, setSearch] = useState<string>("");

	const { filterConversations } = useChat();

	const onUpdate = useEffectEvent(() => {
		if (conversations && conversations.length > 0) {
			setConvos(conversations);
		}
	});

	useEffect(() => {
		onUpdate();
	}, []);

	useEffect(() => {
		if (search.trim() == "") {
			setConvos(conversations);
		} else {
			setConvos(filterConversations(profile.user_id, conversations, search));
		}
	}, [conversations, search]);

	// Render Conversations
	const renderConversations = convos.map((convo) => {
		const { id, created_at, updated_at, participants, messages } = convo;
		const { profile: convoProfile } = participants.find((p) => Number(p.profile.id) !== profile.id)!;
		const { first_name, last_name, avatar_url } = convoProfile;

		const fullName = createFullName(first_name, last_name);

		const lastMessage = messages && messages.length > 0
			? messages[messages.length - 1].content
			: '';

		const numOfUnread = messages ? messages.reduce((count: number, message: MessageProp) => {
			const { is_read } = message;
			return is_read === false ? count + 1 : count;
		}, 0) : 0;

		return (
			<div
				key={id}
				onClick={() => setActiveConvo(convo)}
				className={cn(
					'max-w-sm mx-auto p-4 group flex flex-row items-center gap-4 rounded-xl cursor-pointer transition-smooth border-2 overflow-hidden',
					activeConvo?.id === id
						? "bg-gradient-primary/10 border-primary/30 shadow-soft"
						: "hover:bg-accent/30 border-transparent hover:border-accent/50"
				)}
			>
				<div className="relative flex-shrink-0">
					<AvatarIcon
						src={avatar_url ?? ""}
						fallback={getInitials(fullName)}
						className="ring-2 ring-primary/20 group-hover:ring-primary/40 transition-smooth"
						size="lg"
					/>
				</div>

				<div className="flex-1 min-w-0 overflow-hidden">
					<div className="flex items-center justify-between mb-1 gap-2 w-full h-full">
						<p className="font-semibold text-foreground group-hover:text-primary transition-smooth flex-1 min-w-0 truncate">
							{fullName}
						</p>

						<span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
							{timeAgo(updated_at ?? created_at)}
						</span>
					</div>

					<p className="text-sm text-muted-foreground leading-relaxed truncate w-full">
						{lastMessage}
					</p>
				</div>

				{numOfUnread > 0 && (
					<Badge className="bg-gradient-primary text-primary-foreground shadow-sm min-w-[1.5rem] h-6 flex items-center justify-center flex-shrink-0">
						{numOfUnread}
					</Badge>
				)}
			</div>
		);
	})

	return (
		<Card className="lg:col-span-1 shadow-soft border-0 overflow-hidden h-full">
			<CardHeader className="from-primary/5 to-secondary/5 border-b">
				<div className="mb-2 flex items-center justify-between">
					<CardTitle className="flex items-center gap-3">
						<div className="p-2 bg-gradient-primary rounded-lg">
							<Send className="h-4 w-4 text-grey-200" />
						</div>
						Conversations
					</CardTitle>

					<Button
						onClick={() => setIsDialogOpen(true)}
						className="bg-gradient-primary text-white hover:scale-105 cursor-pointer transition-smooth"
					>
						New Chat
					</Button>
				</div>

				<div className="relative group">
					<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-smooth" />
					<Input
						placeholder="Search conversations..."
						defaultValue={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-12 bg-background/80 border-2 border-muted h-12  focus:border-primary rounded-xl shadow-sm transition-smooth"
					/>
				</div>
			</CardHeader>

			<CardContent className="p-0 h-full">
				{setConvos.length > 0 && <ScrollArea className="h-full">
					<div className="px-4 space-y-2">
						{renderConversations}

					</div>
				</ScrollArea>}

				{setConvos.length === 0 &&
					<div className="mx-auto my-auto flex flex-col justify-center items-center h-full">
						<h2 className="text-2xl font-semibold ">Start Chatting</h2>
						<p className="text-sm text-muted-foreground">Create a fun conversation</p>
					</div>
				}
			</CardContent>

			<StartConversationDialog
				open={isDialogOpen}
				onOpenChange={setIsDialogOpen}
			/>
		</Card>
	);
};