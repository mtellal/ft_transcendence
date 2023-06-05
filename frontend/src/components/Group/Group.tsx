import React from 'react';
import { BackApi } from '../../api/back';
import { GroupList } from '../GroupList/GroupList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { io, Socket } from 'socket.io-client'
import s from './style.module.css'

interface GroupProps {
	myChannels: any;
	setidChannelSelected: any;
}

export function Group({ myChannels, setidChannelSelected }: GroupProps) {

	// const selector = useSelector((store: RootState) => store.user.user);
	// const [socket, setSocket] = useState<Socket | null>(null);


	// Sert a rien ??
	// useEffect(() => {
    //     if (selector.token) {
    //         const newSocket = io('http://localhost:3000', {
    //             transports: ['websocket'],
    //             extraHeaders: {
    //                 'Authorization': `Bearer ${selector.token}`
    //             }
    //         })
    //         setSocket(newSocket);
    //     }
    // }, [setSocket, selector.token])

	return (
		<div>
			{/* <div>
				<form className={s.form} onSubmit={handleSubmit}>
					<input className={s.input} type="text" placeholder="Username" name="username"/>
					<button className={s.button} type="submit">Create group</button>
				</form>
			</div> */}
			<div className={s.list}>
				{myChannels.map((channel: any) => {
					// console.log('okiii', channel);
					if (channel.type !== 'WHISPER') {
						return (
							<span key={channel.id}>
								<GroupList channel={channel} setidChannelSelected={setidChannelSelected} />
							</span>
						);
					}
				})}
			</div>
		</div>
	);
}