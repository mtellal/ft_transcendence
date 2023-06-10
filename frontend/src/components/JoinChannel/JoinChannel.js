import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { BackApi } from '../../api/back';
import { PublicChannels } from '../PublicChannels/PublicChannels';
import { ProtectedChannels } from '../ProtectedChannels/ProtectedChannels';
import { getSocket } from '../../utils/socket';
import s from './style.module.css';
export function JoinChannel({ myChannels }) {
    const [socket, setSocket] = useState(null);
    const [channels, setChannels] = useState();
    async function getAllChannels() {
        const rep = await BackApi.getAllChannels();
        if (rep.status === 200) {
            setChannels(rep.data);
        }
    }
    useEffect(() => {
        getAllChannels();
        setSocket(getSocket());
    }, []);
    if (!socket) {
        return (React.createElement("div", null, "NULL"));
    }
    return (React.createElement("div", { className: s.container },
        "Public channels",
        React.createElement("div", { className: s.pubChan }, channels && React.createElement(PublicChannels, { channels: channels, myChannels: myChannels, socket: socket })),
        "Protected channels",
        channels && React.createElement(ProtectedChannels, { channels: channels, myChannels: myChannels, socket: socket }),
        "Channel invitation"));
}
