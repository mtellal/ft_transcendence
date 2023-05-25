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
				// Le code à exécuter après la pause de 1 seconde
				console.log("Après la pause");
				const response = await BackApi.getWhispers(selector.id, idFriendSelected);
				if (response.status === 200) {
					console.log('Chennel exist');
					setIdChannel(response.data.id);
				  joinChannel(response.data.id);
				}
			  }, 1000); // 1000 millisecondes = 1 seconde
		}
	}

	function joinChannel(idChan) {
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
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selector.id])

	// useEffect(() => {
	// 	if (socket && idChannel) {
	// 		joinChannel()
	// 	}
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [socket, idChannel])

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

	// console.log('messages', messages);

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