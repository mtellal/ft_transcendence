import React from 'react';
export function GroupList({ channel, setidChannelSelected }) {
    function setIdChannel() {
        setidChannelSelected(channel.id);
    }
    return (React.createElement("div", null,
        React.createElement("button", { onClick: setIdChannel }, channel.name ? channel.name : channel.id)));
}
