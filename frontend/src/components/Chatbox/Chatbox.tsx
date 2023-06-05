import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import io, { Socket } from 'socket.io-client'
import { RootState } from '../../store';
import { initializeSocket, getSocket } from '../../utils/socket';
import s from './style.module.css'


export function Chatbox({ idFriendSelected }: {idFriendSelected: number}) {

	const selector = useSelector((store: RootState) => store.user.user);
	const [Asocket, AsetSocket] = useState<any>(null);
	const [messages, setMessages] = useState([]);
	const [idChannel, setIdChannel] = useState();

	const send = (value: string) => {
		Asocket.emit('message', {
			sendBy: selector.id,
			content: value,
			channelId: idChannel,
		});
	}

	async function creteOrJoinChannel() {
		const response = await BackApi.getWhispers(selector.id, idFriendSelected);
		if (response.status === 200) {
			console.log('Chennel exist');
			setMessages([]);
			setIdChannel(response.data.id);
			joinChannel(response.data.id);
			return response.data.id;
		} else {
			console.log('Create chennel');
			const rep = await BackApi.createChannel({
				name: 'testWHISPER',
				type: 'WHISPER',
				members: [idFriendSelected],
			}, selector.token);
			setMessages([]);
			setIdChannel(rep.data.id);
			joinChannel(rep.data.id);
			return rep.data.id;
		}
	}

	function joinChannel(idChan: number) {
		console.log('idChan', idChan);
		Asocket.emit('joinChannel', {
			channelId: idChan
		})
	}

	async function getMessages(id: Promise<any>) {
		const rep = await BackApi.getChannelMessagesById(id);
		if (rep.status === 200) {
			setMessages(rep.data);
		}
	}

	useEffect(() => {
		AsetSocket(getSocket());
	}, [])

	useEffect(() => {
		if (selector.id && Asocket) {
			const fetchData = async () => {
				const id = await creteOrJoinChannel();
				getMessages(id);
			};
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Asocket, selector.id, idFriendSelected]);

	const messageListener = (message: any) => {
		if (message.channelId === idChannel) {
			if (message.length) {
				setMessages(message);
			} else {
				setMessages([...messages, message]);
			}
		}
	}

	useEffect(() => {
		if (selector.id && Asocket) {
			Asocket.on('message', messageListener);
			return () => {
				Asocket.off('message', messageListener)
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageListener, idFriendSelected])

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		send(e.currentTarget.inputText.value);
	}

	return (
		<div className={s.container} >
			{messages && <Messages messages={messages} id={selector.id} />}
			<div className={s.inputBox}>
				<form onSubmit={handleSubmit}>
					<input name='inputText' className={s.input} placeholder='Type your message...'></input>
					<button type='submit'>Send</button>
				</form>
			</div>
		</div>
	);
}