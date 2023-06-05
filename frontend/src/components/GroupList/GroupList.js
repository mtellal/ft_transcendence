import React from 'react';
export function GroupList({ channel, setIdFriendSelected }) {
    function setIdChannel() {
        setIdFriendSelected(channel.id);
    }
    return (React.createElement("div", null,
        React.createElement("button", { onClick: setIdChannel }, channel.name ? channel.name : channel.id)));
}
