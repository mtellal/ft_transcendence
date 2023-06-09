import React from 'react';
import { BackApi } from '../../api/back';
import { GroupList } from '../GroupList/GroupList';
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
    // console.log('REFRESH TESTTTT');
    useEffect(() => {
        // console.log('REFRESH TESTTTT');
        getUserChannels();
    }, [id, idChannelSelected]);
    if (myChannels.length === 0) {
        return (React.createElement("div", null, "Pas de channels"));
    }
    return (React.createElement("div", null,
        React.createElement("div", { className: s.list }, myChannels.map((channel) => {
            if (channel.type !== 'WHISPER') {
                return (React.createElement("span", { key: channel.id },
                    React.createElement(GroupList, { channel: channel, setidChannelSelected: setidChannelSelected })));
            }
            return null;
        }))));
}
