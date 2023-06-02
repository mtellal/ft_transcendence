import React from 'react';
import { Socket } from 'socket.io-client';
import s from './style.module.css'

interface PublicChannelsListProps {
	channel: any;
	socket: Socket | null;
}

export function PublicChannelsList({ channel, socket }: PublicChannelsListProps) {

	function joinChannel() {
		socket.emit('joinChannel', {
			channelId: channel.id
		})
	}

	return (
		<div>
			<button onClick={joinChannel}>{channel.name}</button>
		</div>
	);
}
