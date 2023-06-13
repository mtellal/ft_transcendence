import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { BackApi } from '../../api/back';
import s from './style.module.css'

	interface CreateGroupProps {
		setBtnFriendsRequest: any;
	}

export function CreateGroup({ setBtnFriendsRequest }: CreateGroupProps) {

	const selector = useSelector((store: RootState) => store.user.user);
	const [privacy, setPrivacy] = useState('Public');
	const [err, setErr] = useState(null);

	function handlePrivacyChange(e: React.ChangeEvent<HTMLSelectElement>) {
		setPrivacy(e.target.value);
		setErr(null);
	}

	async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

		e.preventDefault();
		const target = e.target as typeof e.target & {
			name: { value: string };
			privacy: { value: string };
			password?: { value: string };
		};

		if (!target.name.value) {
			setErr('name');
			return ;
		} else if ((e.target as HTMLFormElement).privacy.value === 'Protected' && !target.password.value) {
			setErr('password');
			return ;
		}

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
	}

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
				{err === 'name' && <span className={s.err}>Veuillez entrer un nom de channel</span>}
				{err === 'password' && <span className={s.err}>Veuillez entrer un mot de passe pour le channel</span>}
				<button type='submit'>Create channel</button>
			</form>
		</div>
	);
}
