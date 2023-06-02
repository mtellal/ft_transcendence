import React from 'react';
import { useState } from 'react';
import { Socket } from 'socket.io-client';
import s from './style.module.css'

interface ProtectedChannelsListProps {
	channel: any;
	socket: Socket | null;
}

export function ProtectedChannelsList({ channel, socket }: ProtectedChannelsListProps) {

	const [showPasswordInput, setShowPasswordInput] = useState(false);

	function joinChannel(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		console.log('e.target.password.value', e.currentTarget.password.value);
		socket.emit('joinChannel', {
			channelId: channel.id,
			password: e.currentTarget.password.value
		})
	}

	return (
		<div className={s.container}>
			<button onClick={() => setShowPasswordInput(!showPasswordInput)}>{channel.name}</button>
			{
				showPasswordInput &&
				<form onSubmit={joinChannel}>
				<input name='password' placeholder='Password'/>
				<button type='submit'>Join channel</button>
				</form>
			}
		</div>
	);
}