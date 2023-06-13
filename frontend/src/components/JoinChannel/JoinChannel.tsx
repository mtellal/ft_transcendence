import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { PublicChannels } from '../PublicChannels/PublicChannels';
import { ProtectedChannels } from '../ProtectedChannels/ProtectedChannels';
import { Socket } from 'socket.io-client';
import { getSocket, initializeSocket } from '../../utils/socket';
import s from './style.module.css'

	interface JoinChannelProps {
		myChannels: any;
	}

// export function JoinChannel({ myChannels }: JoinChannelProps) {
export function JoinChannel({ id }: { id: number }) {

	const [socket, setSocket] = useState<Socket | null>(null);
	const [channels, setChannels] = useState();
	const [myChannels, setMyChannels] = useState([]);


	async function getUserChannels() {
		const response = await BackApi.getChannelsByUserId(id);
		if (response.status === 200) {
			setMyChannels(response.data);
		}
	}

	async function getAllChannels() {
		const rep = await BackApi.getAllChannels();
		if (rep.status === 200) {
			let arr = rep.data.filter((obj1: any) => !obj1.banList.includes(id));
			setChannels(arr);
		}
	}

	useEffect(() => {
		getAllChannels();
		getUserChannels();
		setSocket(getSocket());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (!socket) {
		return (
			<div>
				NULL
			</div>
		);
	}

	return (
		<div className={s.container}>
			Public channels
			<div className={s.pubChan}>
				{channels && <PublicChannels channels={channels} myChannels={myChannels} socket={socket}/>}
			</div>
			Protected channels
			{channels && <ProtectedChannels channels={channels} myChannels={myChannels} socket={socket}/>}
			Channel invitation
		</div>
	);
}
