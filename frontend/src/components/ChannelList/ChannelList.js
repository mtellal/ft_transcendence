import React from 'react';
import s from './style.module.css';
export function GroupList({ channel, setidChannelSelected }) {
    function setIdChannel() {
        setidChannelSelected(channel.id);
    }
    return (React.createElement("div", { className: s.container },
        React.createElement("button", { onClick: setIdChannel }, channel.name ? channel.name : channel.id)));
}
