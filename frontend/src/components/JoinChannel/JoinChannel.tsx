import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { PublicChannels } from '../PublicChannels/PublicChannels';
import { ProtectedChannels } from '../ProtectedChannels/ProtectedChannels';
import { RootState } from '../../store';
import { Socket } from 'socket.io-client';
import io from 'socket.io-client'
import s from './style.module.css'

	interface JoinChannelProps {
		myChannels: any;
	}

export function JoinChannel({ myChannels }: JoinChannelProps) {

	const selector = useSelector((store: RootState) => store.user.user);
	const [socket, setSocket] = useState<Socket | null>(null);
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