import { useEffect } from 'react';
import { useState } from 'react';
import { ProtectedChannelsList } from '../ProtectedChannelsList/ProtectedChannelsList';
import { PublicChannelsList } from '../PublicChannelsList/PublicChannelsList';
import s from './style.module.css'

export function ProtectedChannels({ channels, myChannels, socket }) {

	const [channelsNotJoined, setChannelsNotJoined] = useState([]);

	function setArrayChannels() {
		let arr = channels.filter(obj1 => !myChannels.some(obj2 => obj2.id === obj1.id) && obj1.type === 'PROTECTED');
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