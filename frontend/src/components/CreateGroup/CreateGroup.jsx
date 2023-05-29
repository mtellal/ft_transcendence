import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client'
import s from './style.module.css'

export function CreateGroup() {

	const selector = useSelector(store => store.USER.user);
	const [socket, setSocket] = useState();
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

	function handlePrivacyChange(e) {
		setPrivacy(e.target.value);
	}

	// async function handleSubmit(e) {
	function handleSubmit(e) {
		e.preventDefault();
		// const rep = await BackApi.getUserByUsername(e.target.username.value);
		// if (rep.status === 200) {
		if (e.target.privacy.value === 'Public') {
			socket.emit('createChannel', {
				name: e.target.name.value,
				type: "PUBLIC",
				// memberList: [rep.data.id]
			})
		} else if (e.target.privacy.value === 'Private') {
				socket.emit('createChannel', {
					name: e.target.name.value,
					type: "PRIVATE",
					// memberList: [rep.data.id]
				})
		} else {
			socket.emit('createChannel', {
				name: e.target.name.value,
				type: "PROTECTED",
				password: e.target.password.value
				// memberList: [rep.data.id]
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
