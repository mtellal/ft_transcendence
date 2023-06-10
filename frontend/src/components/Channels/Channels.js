import React from 'react';
import { BackApi } from '../../api/back';
import { GroupList } from '../ChannelList/ChannelList';
import { useEffect, useState } from 'react';
import s from './style.module.css';
// export function Group({ myChannels, setidChannelSelected }: GroupProps) {
export function Group({ idChannelSelected, setidChannelSelected, id }) {
    const [myChannels, setMyChannels] = useState([]);
    async function getUserChannels() {
        const response = await BackApi.getChannelsByUserId(id);
        if (response.status === 200) {
            setMyChannels(response.data);
        }
    }
    useEffect(() => {
        getUserChannels();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id, idChannelSelected]);
    if (myChannels.length === 0) {
        return (React.createElement("div", null, "Pas de channels"));
    }
    return (React.createElement("div", { className: s.list }, myChannels.map((channel) => {
        if (channel.type !== 'WHISPER') {
            return (React.createElement("span", { key: channel.id },
                React.createElement(GroupList, { channel: channel, setidChannelSelected: setidChannelSelected })));
        }
        return null;
    })));
}
