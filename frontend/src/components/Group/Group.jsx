import { BackApi } from '../../api/back';
import { GroupList } from '../GroupList/GroupList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client'
import s from './style.module.css'

export function Group({ channels, setIdFriendSelected }) {

	const selector = useSelector(store => store.USER.user);
	const [socket, setSocket] = useState();

	async function handleSubmit(e) {
		e.preventDefault();
		console.log('e.target.username.value', e.target.username.value);
		const rep = await BackApi.getUserByUsername(e.target.username.value);
		console.log('rep.data', rep.data.id);
		if (rep.status === 200) {
			console.log('code === 200')
			socket.emit('createChannel', {
				name: "mgrp",
				type: "PUBLIC",
				memberList: [rep.data.id]
			})
		} else {
			console.log('ERR code api')
		}
	}

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

	return (
        <div>
			<div>
				<form className={s.form} onSubmit={handleSubmit}>
					<input className={s.input} type="text" placeholder="Username" name="username"/>
					<button className={s.button} type="submit">Create group</button>
				</form>
			</div>
            <div className={s.list}>
                {channels.map((channel) => {
                    return (
                        <span key={channel.id}>
                            <GroupList channel={channel} setIdFriendSelected={setIdFriendSelected}/>
                        </span>
                    );
                })}
            </div>
        </div>
	);
}