import React from 'react';
import { BackApi } from '../../api/back';
import { GroupList } from '../GroupList/GroupList';
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

// export function Group({ myChannels, setidChannelSelected }: GroupProps) {
	export function Group({ idChannelSelected, setidChannelSelected, id }: GroupProps) {

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
	}, [id, idChannelSelected])

	if (myChannels.length === 0) {
		return (
			<div>
				Pas de channels
			</div>
		);
	}

	return (
		<div>
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
		</div>
	);
}