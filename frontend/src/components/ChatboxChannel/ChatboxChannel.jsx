import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import io from 'socket.io-client'
import s from './style.module.css'

export function ChatboxChannel({ idFriendSelected }) {

	console.log('id select friend', idFriendSelected);

	const selector = useSelector(store => store.user.user);
	const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);

    const send = (value) => {
        socket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idFriendSelected,
        });
    }

	function joinChannel() {
		socket.emit('joinChannel', {
			channelId: idFriendSelected
		})
	}

	async function invitUser(e) {
		e.preventDefault();
		const rep = await BackApi.getUserByUsername(e.target.invitUser.value);
		if (rep.status === 200) {
			console.log('User invite', rep.data.id);
			socket.emit('addtoChannel', {
				channelId: idFriendSelected,
				userId: rep.data.id,
			})
			console.log('FIN User invite');
		} else {
			console.log('err', rep.status);
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
		if (selector.id && socket) {
			joinChannel();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selector.id])

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
	}, [messageListener])

	return (
		<div className={s.container} >
			<form onSubmit={invitUser}>
				<input name='invitUser' placeholder='Invit user'></input>
				<button type='submit'>Invit</button>
			</form>
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