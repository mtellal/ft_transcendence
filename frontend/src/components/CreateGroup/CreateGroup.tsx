import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { initializeSocket, getSocket } from '../../utils/socket';
import io, { Socket } from 'socket.io-client'
import s from './style.module.css'
import { BackApi } from '../../api/back';
import { useNavigate } from 'react-router-dom';

	interface CreateGroupProps {
		setBtnFriendsRequest: any;
	}

export function CreateGroup({ setBtnFriendsRequest }: CreateGroupProps) {

	const selector = useSelector((store: RootState) => store.user.user);
	// const [Asocket, AsetSocket] = useState<any>(null);
	const [privacy, setPrivacy] = useState('Public');
	// const navigate = useNavigate();

	function handlePrivacyChange(e: React.ChangeEvent<HTMLSelectElement>) {
		setPrivacy(e.target.value);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

		e.preventDefault();
		const target = e.target as typeof e.target & {
			name: { value: string };
			privacy: { value: string };
			password?: { value: string };
		};

		if ((e.target as HTMLFormElement).privacy.value === 'Public') {
			await BackApi.createChannel({
				name: target.name.value,
				type: 'PUBLIC',
			}, selector.token);
		} else if ((e.target as HTMLFormElement).privacy.value === 'Private') {
			await BackApi.createChannel({
				name: target.name.value,
				type: 'PRIVATE',
			}, selector.token);
		} else {
			await BackApi.createChannel({
				name: target.name.value,
				type: 'PROTECTED',
				password: target.password.value
			}, selector.token);
		}
		setBtnFriendsRequest('GROUP');
		// navigate();
	}

	// useEffect(() => {
		// initializeSocket(selector.token);
		// AsetSocket(getSocket());
	// }, [])

	return (
		<div>
			<form className={s.container} onSubmit={handleSubmit} >
				Channel name
				<input name='name' placeholder='Name'/>
				Privacy
				<select name='privacy' onChange={handlePrivacyChange}>
					<option>Public</option>
					<option>Protected</option>
					<option>Private</option>
				</select>
				{privacy === 'Protected' && <input placeholder='password' type='password' name='password'/>}
				<button type='submit'>Create channel</button>
			</form>
		</div>
	);
}
