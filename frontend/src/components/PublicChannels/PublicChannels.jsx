import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { PublicChannelsList } from '../PublicChannelsList/PublicChannelsList';
import s from './style.module.css'

export function PublicChannels({ channels, myChannels, socket }) {

	const [channelsNotJoined, setChannelsNotJoined] = useState([]);

	function setArrayChannels() {
		let arr = channels.filter(obj1 => !myChannels.some(obj2 => obj2.id === obj1.id) && obj1.type === 'PUBLIC');
		setChannelsNotJoined(arr);
	}

	useEffect(() => {
		setArrayChannels();
	}, [])

	// console.log('channels', channels);
	// console.log('channelsNotJoined', channelsNotJoined);

	if (channelsNotJoined.length === 0) {
		return (
			<div>
				Pas de channels public a rejoindre
			</div>
		);
	}

	return (
		<div>
			<div>
				{channelsNotJoined.map((channel) => {
					return (
						<span key={channel.id}>
							<PublicChannelsList channel={channel} socket={socket} />
						</span>
					);
				})}
			</div>
		</div>
	);
}