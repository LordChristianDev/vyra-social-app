import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, MoreVertical, Send } from "lucide-react";

import { cn } from "@/lib/utils";
import { createFullName, getInitials, timeAgo } from "@/lib/formatters";

import {
	Card,
	CardContent,
	CardHeader
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AvatarIcon } from "@/components/common/avatar-icon";

import type { ConversationProp, MessageProp } from "@/features/dashboard/types/message_types";
import type { ProfileProp } from "@/features/personalization/types/profile-types";
import { QUERIES as MESSAGE_QUERIES } from "@/features/dashboard/services/message-services";

type ActiveChatProp = {
	profile: ProfileProp;
	activeConversation: ConversationProp;
	conversationId: number;
};

export const ActiveChat = ({ profile, activeConversation, conversationId }: ActiveChatProp) => {
	const [activeMessages, setActiveMessages] = useState<MessageProp[]>([]);
	const [message, setMessage] = useState<string>("");
	const endRef = useRef<HTMLDivElement>(null);

	const { data: messagesData, isFetching: messagesFetching } = useQuery({
		queryKey: ["active-chat-messages", conversationId],
		queryFn: () => MESSAGE_QUERIES.fetchMessagesByConversationId(conversationId),
		enabled: !!conversationId,
		refetchOnMount: true,
		staleTime: 0,
	});

	useEffect(() => {
		if (messagesData && !messagesFetching) {
			setActiveMessages(messagesData);
		}
	}, [messagesData, messagesFetching]);

	useEffect(() => {
		setActiveMessages([]);
	}, [conversationId]);

	useEffect(() => {
		endRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end'
		});
	}, [activeMessages]);

	const { user_id, first_name, last_name, avatar_url } = profile ?? {} as ProfileProp
	const fullName = createFullName(first_name, last_name);

	// Opposite Participant
	const otherParticipant = activeConversation?.participants?.find((p) => {
		if (!p.profile?.id) return false;
		return Number(p.profile.id) !== profile.id;
	});

	if (!otherParticipant?.profile) {
		return null;
	}

	const handleSubmit = () => {
		if (!message.trim()) return;

		setActiveMessages([...activeMessages, {
			id: activeMessages.length + 1,
			conversation_id: conversationId,
			sender_id: user_id,
			receiver_id: otherParticipant.profile_id,
			sent_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			content: message,
			images: null,
			is_read: false,
			sender: profile,
		}]);

		setMessage('');
	}

	// Render Messages
	const renderMessages = (activeMessages ?? []).map((message, index) => {
		const { sender_id, sent_at, content,
			sender: {
				first_name: sender_first_name,
				last_name: sender_last_name,
				avatar_url: sender_avatar_url
			}
		} = message;

		const isOwn = sender_id == user_id;
		const sender_fullname = createFullName(sender_first_name, sender_last_name);

		return (
			<div
				key={index}
				className={cn(
					"mb-4 flex",
					isOwn ? "justify-end" : "justify-start"
				)}
			>
				<div className={cn(
					"flex items-end gap-2 max-w-[75%]",
					isOwn ? "flex-row-reverse" : "flex-row"
				)}>
					{!isOwn && (
						<AvatarIcon
							src={sender_avatar_url ?? ""}
							fallback={getInitials(sender_fullname)}
						/>
					)}
					<div
						className={`px-4 py-3 rounded-2xl shadow-sm ${isOwn
							? "bg-gradient-primary text-gray-200 rounded-br-md"
							: "bg-card border border-border rounded-bl-md"
							}`}
					>
						<p className="text-sm leading-relaxed">{content}</p>
						<p className={cn(
							"text-xs mt-2",
							isOwn ? "text-gray-300" : "text-muted-foreground"
						)}>
							{timeAgo(sent_at)}
						</p>
					</div>
				</div>
			</div>
		);
	})

	return (
		<Card className=" lg:col-span-2 shadow-soft border-0 h-full flex flex-col">
			<CardHeader className="bg-linear-to-r from-card to-card/50 border-b backdrop-blur-sm shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="relative">
							<AvatarIcon
								src={avatar_url ?? ""}
								fallback={getInitials(fullName)}
								className="ring-2 ring-primary/20"
								size="lg"
							/>
						</div>

						<div>
							<p className="font-semibold text-lg">{fullName}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-smooth">
							<MoreVertical className="h-5 w-5" />
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0 relative flex flex-col flex-1 min-h-0 ">
				{/* Messages */}
				<ScrollArea className="px-6 flex-1 max-h-[66vh]">
					{renderMessages}
					<div ref={endRef} className="h-1" />
				</ScrollArea>

				{/* Message Input */}
				<div className="p-5 bg-linear-to-r from-card/50 to-card border-t rounded-xl shrink-0">
					<div className="flex items-center gap-3">
						<div className="flex-1 relative">
							<Input
								placeholder="Type a message..."
								value={message}
								onChange={(e) => setMessage(e.target.value)}
								className="pr-12 h-12 bg-background/80 border-2 border-muted focus:border-primary rounded-xl shadow-sm transition-smooth"
							/>
						</div>
						<Button
							onClick={handleSubmit}
							className="px-6 bg-gradient-primary text-primary-foreground cursor-pointer shadow-soft hover:shadow-medium transition-smooth"
							disabled={!message.trim()}
						>
							<Send className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{messagesFetching && (
					<div className="absolute inset-0 z-50 flex items-center justify-center">
						<div className="flex flex-col items-center gap-4">
							<Loader2 className="h-12 w-12 animate-spin text-violet-600" />
							<p className="text-white font-medium text-lg">Please wait...</p>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};