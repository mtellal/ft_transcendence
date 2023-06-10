import React from 'react';
import s from './style.module.css';
export function PublicChannelsList({ channel, socket, channelsNotJoined, setChannelsNotJoined }) {
    function joinChannel() {
        socket.emit('joinChannel', {
            channelId: channel.id
        });
        let newArray = channelsNotJoined.filter((obj) => obj.id !== channel.id);
        setChannelsNotJoined(newArray);
    }
    return (React.createElement("div", { className: s.container },
        React.createElement("button", { onClick: joinChannel }, channel.name)));
}
