import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { PublicChannelsList } from '../PublicChannelsList/PublicChannelsList';
import { Socket } from 'socket.io-client';
import s from './style.module.css'

interface PublicChannelsProps {
	channels: any;
	myChannels: any;
	socket: Socket | null;
}

export function PublicChannels({ channels, myChannels, socket }: PublicChannelsProps) {

	const [channelsNotJoined, setChannelsNotJoined] = useState([]);

	function setArrayChannels() {
		let arr = channels.filter((obj1: any) => !myChannels.some((obj2: any) => obj2.id === obj1.id) && obj1.type === 'PUBLIC');
		setChannelsNotJoined(arr);
	}

	useEffect(() => {
		setArrayChannels();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (channelsNotJoined.length === 0) {
		return (
			<div>
				Pas de channels public a rejoindre
			</div>
		);
	}

	console.log('chan not join', channelsNotJoined);

	return (
		<div>
			<div className={s.container}>
				{channelsNotJoined.map((channel) => {
					return (
						<span key={channel.id}>
							<PublicChannelsList channel={channel} socket={socket} channelsNotJoined={channelsNotJoined} setChannelsNotJoined={setChannelsNotJoined}/>
						</span>
					);
				})}
			</div>
		</div>
	);
}