import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { ProtectedChannelsList } from '../ProtectedChannelsList/ProtectedChannelsList';
import { PublicChannelsList } from '../PublicChannelsList/PublicChannelsList';
import s from './style.module.css'
import { Socket } from 'socket.io-client';

interface ProtectedChannelsProps {
	channels: any;
	myChannels: any;
	socket: Socket | null;
}

export function ProtectedChannels({ channels, myChannels, socket }: ProtectedChannelsProps) {

	const [channelsNotJoined, setChannelsNotJoined] = useState([]);

	function setArrayChannels() {
		let arr = channels.filter((obj1: any) => !myChannels.some((obj2: any) => obj2.id === obj1.id) && obj1.type === 'PROTECTED');
		setChannelsNotJoined(arr);
	}

	useEffect(() => {
		setArrayChannels();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (channelsNotJoined.length === 0) {
		return (
			<div>
				Pas de channels Protected a rejoindre
			</div>
		);
	}

	return (
		<div>
			<div className={s.container}>
				{channelsNotJoined.map((channel) => {
					return (
						<span key={channel.id}>
							<ProtectedChannelsList channel={channel} socket={socket} />
						</span>
					);
				})}
			</div>
		</div>
	);
}