import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { PublicChannels } from '../PublicChannels/PublicChannels';
import { ProtectedChannels } from '../ProtectedChannels/ProtectedChannels';
import io from 'socket.io-client';
export function JoinChannel({ myChannels }) {
    const selector = useSelector((store) => store.user.user);
    const [socket, setSocket] = useState(null);
    const [channels, setChannels] = useState();
    async function getAllChannels() {
        const rep = await BackApi.getAllChannels();
        if (rep.status === 200) {
            setChannels(rep.data);
        }
    }
    useEffect(() => {
        if (selector.token) {
            const newSocket = io('http://localhost:3000', {
                transports: ['websocket'],
                extraHeaders: {
                    'Authorization': `Bearer ${selector.token}`
                }
            });
            setSocket(newSocket);
        }
    }, [setSocket, selector.token]);
    useEffect(() => {
        getAllChannels();
    }, []);
    return (React.createElement("div", null,
        "Public channels",
        channels && React.createElement(PublicChannels, { channels: channels, myChannels: myChannels, socket: socket }),
        "Protected channels",
        channels && React.createElement(ProtectedChannels, { channels: channels, myChannels: myChannels, socket: socket }),
        "Channel invitation"));
}
