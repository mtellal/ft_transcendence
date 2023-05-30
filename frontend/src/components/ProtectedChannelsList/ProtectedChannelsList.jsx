import { useState } from 'react';
import s from './style.module.css'

export function ProtectedChannelsList({ channel, socket }) {

	const [showPasswordInput, setShowPasswordInput] = useState(false);

	function joinChannel(e) {
		e.preventDefault();
		console.log('e.target.password.value', e.target.password.value);
		socket.emit('joinChannel', {
			channelId: channel.id,
			password: e.target.password.value
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