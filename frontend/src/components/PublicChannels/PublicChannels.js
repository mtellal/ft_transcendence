import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { PublicChannelsList } from '../PublicChannelsList/PublicChannelsList';
export function PublicChannels({ channels, myChannels, socket }) {
    const [channelsNotJoined, setChannelsNotJoined] = useState([]);
    function setArrayChannels() {
        let arr = channels.filter((obj1) => !myChannels.some((obj2) => obj2.id === obj1.id) && obj1.type === 'PUBLIC');
        setChannelsNotJoined(arr);
    }
    useEffect(() => {
        setArrayChannels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    if (channelsNotJoined.length === 0) {
        return (React.createElement("div", null, "Pas de channels public a rejoindre"));
    }
    return (React.createElement("div", null,
        React.createElement("div", null, channelsNotJoined.map((channel) => {
            return (React.createElement("span", { key: channel.id },
                React.createElement(PublicChannelsList, { channel: channel, socket: socket })));
        }))));
}
