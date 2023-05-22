import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client'
import s from './style.module.css'
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';

export function Chatbox({ idFriendSelected }) {

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
		const response = await BackApi.getWhispers(selector.id, idFriendSelected);
		if (response.status === 200) {
			setIdChannel(response.data.id);
		} else {
			socket.emit('createChannel', {
				name: "mp",
				type: "WHISPER",
				memberList: [idFriendSelected]
			})
			const rep = await BackApi.getWhispers(selector.id, idFriendSelected);
			if (rep.status === 200) {
				setIdChannel(rep.data.id);
			}
		}
	}

	function joinChannel() {
		socket.emit('joinChannel', {
			channelId: idChannel
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
    }, [socket, selector.id])

	useEffect(() => {
		if (socket && idChannel) {
			joinChannel()
		}
	}, [socket, idChannel])

	const messageListener = (message) => {
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
	}, [messageListener])

	console.log('messages', messages);

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