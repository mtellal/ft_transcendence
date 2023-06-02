import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import io, { Socket } from 'socket.io-client'
import s from './style.module.css'

export function CreateGroup() {

	const selector = useSelector((store: RootState) => store.user.user);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [privacy, setPrivacy] = useState('Public');

	useEffect(() => {
        if (selector.token) {
            const newSocket = io('http://localhost:3000', {
                transports: ['websocket'],
                extraHeaders: {
                    'Authorization': `Bearer ${selector.token}`
                }
            })
            setSocket(newSocket);
        }
    }, [setSocket, selector.token])

	function handlePrivacyChange(e: React.ChangeEvent<HTMLSelectElement>) {
		setPrivacy(e.target.value);
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {

		const target = e.target as typeof e.target & {
			name: { value: string };
			privacy: { value: string };
			password?: { value: string };
		};

		e.preventDefault();
		if ((e.target as HTMLFormElement).privacy.value === 'Public') {
				socket.emit('createChannel', {
				name: target.name.value,
				type: "PUBLIC",
			})
		} else if ((e.target as HTMLFormElement).privacy.value === 'Private') {
				socket.emit('createChannel', {
					name: target.name.value,
					type: "PRIVATE",
				})
		} else {
			socket.emit('createChannel', {
				name: target.name.value,
				type: "PROTECTED",
				password: (e.target as HTMLFormElement).password.value
			})
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
				<button type='submit'>Create channel</button>
			</form>
		</div>
	);
}
