import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {

	if (!socket) {
	socket = io('http://localhost:3000', {
			transports: ['websocket'],
			extraHeaders: {
				'Authorization': `Bearer ${token}`
			}
		})
	}
};

export const getSocket = () => {
	if (!socket) {
		throw new Error('Socket is not initialized. Call initializeSocket() first.');
	}
	return socket;
};
