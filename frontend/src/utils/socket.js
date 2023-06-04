import { io } from 'socket.io-client';
let socket = null;
export const initializeSocket = (token) => {
    if (!socket) {
        // socket = io('http://localhost:3000'); // Remplacez l'URL par votre URL de socket.io
        socket = io('http://localhost:3000', {
            transports: ['websocket'],
            extraHeaders: {
                'Authorization': `Bearer ${token}`
            }
        });
    }
};
export const getSocket = () => {
    if (!socket) {
        throw new Error('Socket is not initialized. Call initializeSocket() first.');
    }
    return socket;
};
