import React from 'react';
import { GroupList } from '../GroupList/GroupList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import s from './style.module.css';
export function Group({ myChannels, setIdFriendSelected }) {
    const selector = useSelector((store) => store.user.user);
    const [socket, setSocket] = useState(null);
    // Sert a rien ??
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
    return (React.createElement("div", null,
        React.createElement("div", { className: s.list }, myChannels.map((channel) => {
            return (React.createElement("span", { key: channel.id },
                React.createElement(GroupList, { channel: channel, setIdFriendSelected: setIdFriendSelected })));
        }))));
}
