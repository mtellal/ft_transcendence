import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { PublicChannels } from '../PublicChannels/PublicChannels';
import io from 'socket.io-client'
import s from './style.module.css'
import { ProtectedChannels } from '../ProtectedChannels/ProtectedChannels';

export function JoinChannel({ myChannels }) {

	const selector = useSelector(store => store.user.user);
	const [socket, setSocket] = useState();
	const [channels, setChannels] = useState();

	async function getAllChannels() {
		const rep = await BackApi.getAllChannels();
		if (rep.status === 200) {
			setChannels(rep.data);
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

	useEffect(() => {
		getAllChannels();
	}, [])

	return (
		<div>
			Public channels
			{channels && <PublicChannels channels={channels} myChannels={myChannels} socket={socket}/>}
			Protected channels
			{channels && <ProtectedChannels channels={channels} myChannels={myChannels} socket={socket}/>}
			Channel invitation
		</div>
	);
}