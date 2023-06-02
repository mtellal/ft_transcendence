import React from 'react';
export function GroupList({ channel, setIdFriendSelected }) {
    function test() {
        setIdFriendSelected(channel.id);
    }
    return (React.createElement("div", null,
        React.createElement("button", { onClick: test }, channel.name ? channel.name : channel.id)));
}
