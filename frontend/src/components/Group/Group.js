import React from 'react';
import { GroupList } from '../GroupList/GroupList';
import s from './style.module.css';
export function Group({ myChannels, setidChannelSelected }) {
    return (React.createElement("div", null,
        React.createElement("div", { className: s.list }, myChannels.map((channel) => {
            if (channel.type !== 'WHISPER') {
                return (React.createElement("span", { key: channel.id },
                    React.createElement(GroupList, { channel: channel, setidChannelSelected: setidChannelSelected })));
            }
            return null;
        }))));
}
