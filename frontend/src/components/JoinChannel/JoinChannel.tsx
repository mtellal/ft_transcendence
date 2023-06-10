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

export function JoinChannel({ myChannels }: JoinChannelProps) {

	const [socket, setSocket] = useState<Socket | null>(null);
	const [channels, setChannels] = useState();

	async function getAllChannels() {
		const rep = await BackApi.getAllChannels();
		if (rep.status === 200) {
			setChannels(rep.data);
		}
	}

	useEffect(() => {
		getAllChannels();
		setSocket(getSocket());
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
