import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ProtectedChannelsList } from '../ProtectedChannelsList/ProtectedChannelsList';
import s from './style.module.css';
export function ProtectedChannels({ channels, myChannels, socket }) {
    const [channelsNotJoined, setChannelsNotJoined] = useState([]);
    function setArrayChannels() {
        let arr = channels.filter((obj1) => !myChannels.some((obj2) => obj2.id === obj1.id) && obj1.type === 'PROTECTED');
        setChannelsNotJoined(arr);
    }
    useEffect(() => {
        setArrayChannels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (channelsNotJoined.length === 0) {
        return (React.createElement("div", null, "Pas de channels Protected a rejoindre"));
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: s.container }, channelsNotJoined.map((channel) => {
            return (React.createElement("span", { key: channel.id },
                React.createElement(ProtectedChannelsList, { channel: channel, socket: socket })));
        }))));
}
