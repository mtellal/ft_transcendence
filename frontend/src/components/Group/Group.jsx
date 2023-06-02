import { BackApi } from '../../api/back';
import { GroupList } from '../GroupList/GroupList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client'
import s from './style.module.css'

export function Group({ myChannels, setIdFriendSelected }) {

	const selector = useSelector(store => store.user.user);
	const [socket, setSocket] = useState();

	// async function handleSubmit(e) {
	// 	e.preventDefault();
	// 	const rep = await BackApi.getUserByUsername(e.target.username.value);
	// 	if (rep.status === 200) {
	// 		socket.emit('createChannel', {
	// 			name: "mgrp",
	// 			type: "PUBLIC",
	// 			memberList: [rep.data.id]
	// 		})
	// 	}
	// }

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
			{/* <div>
				<form className={s.form} onSubmit={handleSubmit}>
					<input className={s.input} type="text" placeholder="Username" name="username"/>
					<button className={s.button} type="submit">Create group</button>
				</form>
			</div> */}
            <div className={s.list}>
                {myChannels.map((channel) => {
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