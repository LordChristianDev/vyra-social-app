import WebSocket from 'ws';
import { Server } from 'http';

export interface WebSocketClient extends WebSocket {
	conversationId?: number;
	userId?: number;
}

class WebSocketServer {
	private wss: WebSocket.Server | null = null;
	private clients: Map<number, Set<WebSocketClient>> = new Map();

	initialize(server: Server) {
		this.wss = new WebSocket.Server({ server });

		this.wss.on('connection', (ws: WebSocketClient, req) => {
			console.log('New WebSocket connection');

			ws.on('message', (message: string) => {
				try {
					const data = JSON.parse(message.toString());

					if (data.type === 'subscribe') {
						// Subscribe to a conversation
						ws.conversationId = data.conversation_id;
						ws.userId = data.user_id;

						if (!this.clients.has(data.conversation_id)) {
							this.clients.set(data.conversation_id, new Set());
						}
						this.clients.get(data.conversation_id)?.add(ws);

						console.log(`Client subscribed to conversation ${data.conversation_id}`);
					}
				} catch (error) {
					console.error('Error parsing message:', error);
				}
			});

			ws.on('close', () => {
				// Remove client from all conversations
				if (ws.conversationId) {
					const conversationClients = this.clients.get(ws.conversationId);
					if (conversationClients) {
						conversationClients.delete(ws);
						if (conversationClients.size === 0) {
							this.clients.delete(ws.conversationId);
						}
					}
				}
				console.log('Client disconnected');
			});

			ws.on('error', (error) => {
				console.error('WebSocket error:', error);
			});
		});
	}

	// Broadcast new message to all clients in a conversation
	broadcastToConversation(conversationId: number, data: any) {
		const conversationClients = this.clients.get(conversationId);

		if (conversationClients) {
			const message = JSON.stringify({
				type: 'new_message',
				data,
			});

			conversationClients.forEach((client) => {
				if (client.readyState === WebSocket.OPEN) {
					client.send(message);
				}
			});
		}
	}
}

export const wsServer = new WebSocketServer();