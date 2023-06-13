import React from 'react';
import { BackApi } from '../../api/back';
import { GroupList } from '../ChannelList/ChannelList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { io, Socket } from 'socket.io-client'
import s from './style.module.css'

interface GroupProps {
	// myChannels: any;
	idChannelSelected: any;
	setidChannelSelected: any;
	id: number;
}

	// export function Group({ myChannels, idChannelSelected, setidChannelSelected, id }: GroupProps) {
	export function Channels({ idChannelSelected, setidChannelSelected, id }: GroupProps) {

	const [myChannels, setMyChannels] = useState([]);

	async function getUserChannels() {
		const response = await BackApi.getChannelsByUserId(id);
		if (response.status === 200) {
			setMyChannels(response.data);
		}
	}

	useEffect(() => {
		setTimeout(getUserChannels, 20);

		// getUserChannels();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [id, idChannelSelected])

	// console.log('my Channels', myChannels);

	if (myChannels.length === 0) {
		return (
			<div>
				Pas de channels
			</div>
		);
	}

	return (
			<div className={s.list}>
				{myChannels.map((channel: any) => {
					if (channel.type !== 'WHISPER') {
						return (
							<span key={channel.id}>
								<GroupList channel={channel} setidChannelSelected={setidChannelSelected} />
							</span>
						);
					}
					return null;
				})}
			</div>
	);
}