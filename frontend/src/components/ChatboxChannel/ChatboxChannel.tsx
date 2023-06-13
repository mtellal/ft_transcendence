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
import { useNavigate } from 'react-router-dom';

interface ChatboxChannelProps {
	myChannels: any;
	setMyChannels: any;
	idChannelSelected: any;
	setidChannelSelected: any;
}

export function ChatboxChannel({ myChannels, setMyChannels, idChannelSelected, setidChannelSelected }: ChatboxChannelProps) {

	const selector = useSelector((store: RootState) => store.user.user);
	const [Asocket, AsetSocket] = useState<any>(null);
    const [messages, setMessages] = useState([]);
    const [dataChannel, setDataChannel] = useState(null);
    const [rerender, setRerender] = useState(false);

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

	const messageListener = (message: any) => {
		console.log('MESSAGE', message);
		if (message.channelId === idChannelSelected) {
			if (message.length) {
				setMessages(message);
			} else {
				setMessages([...messages, message]);
			}
			if (message.type === 'NOTIF') {
				console.log('NOTIF');
				setRerender(!rerender);
			}
		}
	}

	const kickListenner = (message: any) => {
		if (message.channelId === idChannelSelected &&
			message.userId === selector.id) {
			setidChannelSelected(null);
		} else {
			getDataChannel();
		}
	}

	async function getDataChannel() {
		const rep = await BackApi.getChannelById(idChannelSelected);
		setDataChannel(rep.data);
	}

	function leaveChannel() {
		Asocket.emit('leaveChannel', {
			channelId: idChannelSelected,
		})
		// let arr = channels.filter((obj1: any) => !myChannels.some((obj2: any) => obj2.id === obj1.id) && obj1.type === 'PUBLIC');
		// let arr = myChannels.filter((obj1: any) => obj1.id !== idChannelSelected);
		// console.log('arr after leav channel', arr);
		// setMyChannels(arr);
		setidChannelSelected(null);
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

	useEffect(() => {
		if (selector.id && Asocket) {
			Asocket.on('message', messageListener);
			Asocket.on('kickedUser', kickListenner);
			return () => {
				Asocket.off('message', messageListener)
			}
		}
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageListener, idChannelSelected])

	useEffect(() => {
		AsetSocket(getSocket());
		getDataChannel();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [idChannelSelected, rerender])

	return (
		<div className={s.container} >
			{dataChannel && dataChannel.type === 'PRIVATE' && <form onSubmit={invitUser}>
				<input name='invitUser' placeholder='Invit user'></input>
				<button type='submit'>Invit</button>
			</form>}
			{dataChannel && <ChannelUsers dataChannel={dataChannel}/>}
			<button onClick={leaveChannel}>Leave channel</button>
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