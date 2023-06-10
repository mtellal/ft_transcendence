import React from 'react';
import { Socket } from 'socket.io-client';
import s from './style.module.css'

interface PublicChannelsListProps {
	channel: any;
	socket: Socket | null;
	channelsNotJoined: any;
	setChannelsNotJoined: any;
}

export function PublicChannelsList({ channel, socket,channelsNotJoined, setChannelsNotJoined }: PublicChannelsListProps) {

	function joinChannel() {
		socket.emit('joinChannel', {
			channelId: channel.id
		})
		let newArray = channelsNotJoined.filter((obj: any) => obj.id !== channel.id);
		setChannelsNotJoined(newArray);
		
	}

	return (
		<div className={s.container}>
			<button onClick={joinChannel}>{channel.name}</button>
		</div>
	);
}