import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import io, { Socket } from 'socket.io-client'
import s from './style.module.css'
import { RootState } from '../../store';

export function Chatbox({ idFriendSelected }: {idFriendSelected: number}) {

    const selector = useSelector((store: RootState) => store.user.user);
	const [socket, setSocket] = useState<Socket | null>();
    const [messages, setMessages] = useState([]);
    const [idChannel, setIdChannel] = useState();

    const send = (value: string) => {
        socket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idChannel,
        });
    }

	async function creteOrJoinChannel() {
		const response = await BackApi.getWhispers(selector.id, idFriendSelected);
		if (response.status === 200) {
			console.log('Chennel exist');
			setIdChannel(response.data.id);
			joinChannel(response.data.id);
		} else {
			console.log('Create chennel');
			socket.emit('createChannel', {
				name: "mp",
				type: "WHISPER",
				memberList: [idFriendSelected]
			})
			setTimeout(async function() {
				const response = await BackApi.getWhispers(selector.id, idFriendSelected);
				if (response.status === 200) {
					console.log('Chennel exist');
					setIdChannel(response.data.id);
					joinChannel(response.data.id);
				}
			  }, 1000);
		}
	}

	function joinChannel(idChan: number) {
		console.log('idChan', idChan);
		socket.emit('joinChannel', {
			channelId: idChan
		})
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
    }, [setSocket, selector.token, idFriendSelected])

    useEffect(() => {
		if (selector.id && socket) {
			creteOrJoinChannel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selector.id, idFriendSelected])

	const messageListener = (message: any) => {
		console.log('Msg', message);
		if (message.length) {
			setMessages(message);
		} else {
			setMessages([...messages, message]);
		}
	}

	useEffect(() => {
		if (selector.id && socket) {
			socket.on('message', messageListener);
			return () => {
				socket.off('message', messageListener)
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