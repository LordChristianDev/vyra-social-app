import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Send } from "lucide-react";

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
import { CONTROLLER as MESSAGE_CONTROLLER } from "@/features/dashboard/services/message-services";

type ActiveChatProp = {
	profile: ProfileProp;
	activeConversation: ConversationProp;
	conversationId: number;
};

export const ActiveChat = ({ profile, activeConversation, conversationId }: ActiveChatProp) => {
	const [activeMessages, setActiveMessages] = useState<MessageProp[]>([]);
	const [message, setMessage] = useState<string>("");
	const endRef = useRef<HTMLDivElement>(null);
	const wsRef = useRef<WebSocket | null>(null);

	const { data: messagesData, isFetching: messagesFetching } = useQuery({
		queryKey: ["active-chat-messages", conversationId],
		queryFn: () => MESSAGE_CONTROLLER.FetchMessagesWithConversationId(conversationId),
		enabled: !!conversationId,
		refetchOnMount: true,
		staleTime: 0,
	});

	useEffect(() => {
		setActiveMessages([])
	}, [conversationId])

	// Initialize WebSocket connection
	useEffect(() => {
		if (!conversationId) return;

		// Create WebSocket connection
		const ws = new WebSocket('ws://localhost:4000');
		wsRef.current = ws;

		ws.onopen = () => {
			console.log('WebSocket connected');
			// Subscribe to conversation
			ws.send(JSON.stringify({
				type: 'subscribe',
				conversation_id: conversationId,
				user_id: profile.user_id,
			}));
		};

		ws.onmessage = (event) => {
			try {
				const response = JSON.parse(event.data);

				if (response.type === 'new_message') {
					// Update messages with new data from WebSocket
					setActiveMessages(response.data);
				}
			} catch (error) {
				console.error('Error parsing WebSocket message:', error);
			}
		};

		ws.onerror = (error) => {
			console.error('WebSocket error:', error);
		};

		ws.onclose = () => {
			console.log('WebSocket disconnected');
		};

		// Cleanup on unmount or conversation change
		return () => {
			if (ws.readyState === WebSocket.OPEN) {
				ws.close();
			}
		};
	}, [conversationId, profile.user_id]);

	useEffect(() => {
		if (messagesData && !messagesFetching) {
			setActiveMessages(messagesData);
		}
	}, [messagesData, messagesFetching]);

	useEffect(() => {
		endRef.current?.scrollIntoView({
			behavior: 'smooth',
			block: 'end'
		});
	}, [activeMessages]);

	// Opposite Participant
	const otherParticipant = activeConversation?.participants?.find((p) => {
		if (!p.profile?.id) return false;
		return Number(p.profile.id) !== profile.id;
	});

	if (!otherParticipant?.profile) {
		return null;
	}

	const handleSubmit = async () => {
		if (!message.trim()) return;

		// Optimistic update
		const optimisticMessage: MessageProp = {
			id: Date.now(), // Temporary ID
			conversation_id: conversationId,
			sender_id: profile.user_id,
			receiver_id: otherParticipant.profile_id,
			sent_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
			content: message,
			images: null,
			is_read: false,
			sender: profile,
		};

		setActiveMessages([...activeMessages, optimisticMessage]);
		setMessage('');

		try {
			await MESSAGE_CONTROLLER.SendMessage(
				conversationId,
				profile.user_id,
				otherParticipant.profile_id,
				message
			);
			// WebSocket will handle updating with the real message from server
		} catch (error) {
			console.error('Failed to send message:', error);
			// Remove optimistic message on error
			setActiveMessages(activeMessages);
		}
	};

	const sortedMessages = (activeMessages ?? []).sort((a, b) =>
		new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
	);

	// Render Messages
	const renderMessages = (sortedMessages ?? []).map((message, index) => {
		const { sender_id, sent_at, content } = message;

		// Find the sender from participants
		const participant = activeConversation.participants.find((p) => p.profile_id === sender_id);

		// Skip rendering if sender not found yet
		if (!participant?.profile) {
			return null;
		}

		const sender = participant.profile;
		const {
			first_name: sender_first_name,
			last_name: sender_last_name,
			avatar_url: sender_avatar_url
		} = sender;

		const isOwn = sender_id == profile.user_id;
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
	}).filter(Boolean); // Remove null entries

	return (
		<Card className=" lg:col-span-2 shadow-soft border-0 h-full flex flex-col">
			<CardHeader className="bg-linear-to-r from-card to-card/50 border-b backdrop-blur-sm shrink-0">
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-4">
						<div className="relative">
							<Link to={`/view-profile/${otherParticipant.profile.user_id}`}>
								<AvatarIcon
									src={otherParticipant.profile.avatar_url ?? ""}
									fallback={getInitials(createFullName(otherParticipant.profile.first_name, otherParticipant.profile.last_name))}
									className="ring-2 ring-primary/20"
									size="lg"
								/>
							</Link>
						</div>

						<div>
							<p className="font-semibold text-lg">{createFullName(otherParticipant.profile.first_name, otherParticipant.profile.last_name)}</p>
						</div>
					</div>

					<div className="flex items-center gap-2">
						<Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary transition-smooth">
							{/* <MoreVertical className="h-5 w-5" /> */}
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent className="p-0 relative flex flex-col flex-1 min-h-0 ">
				{/* Messages */}
				<ScrollArea className="px-6 flex-1 max-h-[66vh]">
					{sortedMessages && sortedMessages.length > 0 && renderMessages}
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
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault();
										handleSubmit();
									}
								}}
								className="pr-12 h-12 bg-background/80 border-2 border-muted focus:border-primary rounded-xl shadow-sm transition-smooth"
							/>
						</div>
						<Button
							onClick={handleSubmit}
							className="px-6 bg-gradient-primary text-gray-200 cursor-pointer shadow-soft hover:shadow-medium transition-smooth"
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