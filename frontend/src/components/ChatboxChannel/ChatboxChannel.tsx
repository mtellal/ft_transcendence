import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import { RootState } from '../../store';
import { Socket } from 'socket.io-client';
import { initializeSocket, getSocket } from '../../utils/socket';
import io from 'socket.io-client'
import s from './style.module.css'
import { ChannelUsers } from '../ChannelUsers/ChannelUsers';

export function ChatboxChannel({ idChannelSelected }: {idChannelSelected: number}) {

	const selector = useSelector((store: RootState) => store.user.user);
	const [Asocket, AsetSocket] = useState<any>(null);
    const [messages, setMessages] = useState([]);
    const [dataChannel, setDataChannel] = useState(null);

    const send = (value: string) => {
        Asocket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idChannelSelected,
        });
    }

	function joinChannel() {
		Asocket.emit('joinChannel', {
			channelId: idChannelSelected
		})
	}

	async function invitUser(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const rep = await BackApi.getUserByUsername(e.currentTarget.invitUser.value);
		if (rep.status === 200) {
			Asocket.emit('addtoChannel', {
				channelId: idChannelSelected,
				userId: rep.data.id,
			})
		}
	}

	function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		send(e.currentTarget.inputText.value);
	}

	async function getMessages(id: Promise<any> | any) {
		const rep = await BackApi.getChannelMessagesById(id);
		if (rep.status === 200) {
			setMessages(rep.data);
		} else {
			setMessages([]);
		}
	}

	useEffect(() => {
		if (selector.id && Asocket) {
			const fetchData = async () => {
				joinChannel();
				await getMessages(idChannelSelected);
			};
			fetchData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [Asocket, selector.id, idChannelSelected]);

	const messageListener = (message: any) => {
		if (message.channelId === idChannelSelected) {
			if (message.length) {
				setMessages(message);
			} else {
				setMessages([...messages, message]);
			}
		}
	}

	async function getDataChannel() {
		const rep = await BackApi.getChannelById(idChannelSelected);
		setDataChannel(rep.data);
	}

	useEffect(() => {
		if (selector.id && Asocket) {
			Asocket.on('message', messageListener);
			return () => {
				Asocket.off('message', messageListener)
			}
		}
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageListener, idChannelSelected])

	useEffect(() => {
		AsetSocket(getSocket());
		getDataChannel();
	}, [idChannelSelected])

	// console.log('idChannelSelected', idChannelSelected);
	// console.log('dataChannel', dataChannel);
	// console.log('OKKKKK');

	return (
		<div className={s.container} >
			{dataChannel && dataChannel.type === 'PRIVATE' && <form onSubmit={invitUser}>
				<input name='invitUser' placeholder='Invit user'></input>
				<button type='submit'>Invit</button>
			</form>}
			{dataChannel && <ChannelUsers dataChannel={dataChannel}/>}
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