import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import io from 'socket.io-client'
import s from './style.module.css'

export function ChatboxChannel() {

	const selector = useSelector(store => store.USER.user);
	const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);
    const [idChannel, setIdChannel] = useState();

    const send = (value) => {
        socket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idChannel,
        });
    }

	async function creteOrJoinChannel() {
		// console.log('idFriendSelected', idFriendSelected)
		const response = await BackApi.getChannelsById(selector.id);
		if (response.data.length === 1) {
			console.log('GROUP Chennel exist');
			// console.log('REP', response.data);
			// console.log('TEST 2', response.data[0].id);
			setIdChannel(response.data[0].id);
			joinChannel(response.data[0].id);
		} else if (response.data.length === 0) {
			console.log('response.data.length === 0');
			console.log('GROUP Create chennel');
			socket.emit('createChannel', {
				name: "mgrp",
				type: "PUBLIC",
				// memberList: [idFriendSelected]
			})
			setTimeout(async function() {
				const response = await BackApi.getChannelsById(selector.id);
				if (response.status.length === 1) {
					console.log('GROUP Chennel exist');
					// console.log('TEST 1', response.data.id);
					// console.log('TEST 2', response.data[0].id);
					setIdChannel(response.data[0].id);
					joinChannel(response.data[0].id);
				}
			  }, 1000);
		} else {
			console.log('ERR Len est ni 0 ni 1');
		}
	}

	function joinChannel(idChan) {
		console.log('GROUP idChan', idChan);
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
    }, [setSocket, selector.token])

    useEffect(() => {
		if (selector.id && socket) {
			creteOrJoinChannel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selector.id])

	const messageListener = (message) => {
		console.log('GROUP Msg', message);
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
	}, [messageListener])

	return (
		<div className={s.container} >
			{messages && <Messages messages={messages} id={selector.id} />}
			<div className={s.inputBox}>
				<form onSubmit={(e) => {
					e.preventDefault()
					send(e.target.inputText.value);
				}}>
					<input name='inputText' className={s.input} placeholder='Type your message...'></input>
					<button type='submit'>Send</button>
				</form>
			</div>
		</div>
	);
}