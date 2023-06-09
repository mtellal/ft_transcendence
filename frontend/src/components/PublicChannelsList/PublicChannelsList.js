import React from 'react';
export function PublicChannelsList({ channel, socket, channelsNotJoined, setChannelsNotJoined }) {
    function joinChannel() {
        // console.log('Join channel', channel.id);
        socket.emit('joinChannel', {
            channelId: channel.id
        });
        let newArray = channelsNotJoined.filter((obj) => obj.id !== channel.id);
        setChannelsNotJoined(newArray);
    }
    return (React.createElement("div", null,
        React.createElement("button", { onClick: joinChannel }, channel.name)));
}
