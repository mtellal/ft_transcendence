import React from 'react';
export function PublicChannelsList({ channel, socket }) {
    function joinChannel() {
        socket.emit('joinChannel', {
            channelId: channel.id
        });
    }
    return (React.createElement("div", null,
        React.createElement("button", { onClick: joinChannel }, channel.name)));
}
