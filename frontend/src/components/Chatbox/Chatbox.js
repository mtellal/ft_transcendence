import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import io from 'socket.io-client';
import s from './style.module.css';
export function Chatbox({ idFriendSelected }) {
    const selector = useSelector((store) => store.user.user);
    const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);
    const [idChannel, setIdChannel] = useState();
    const send = (value) => {
        socket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idChannel,
        });
    };
    async function creteOrJoinChannel() {
        const response = await BackApi.getWhispers(selector.id, idFriendSelected);
        if (response.status === 200) {
            console.log('Chennel exist');
            setIdChannel(response.data.id);
            joinChannel(response.data.id);
        }
        else {
            console.log('Create chennel');
            const rep = await BackApi.createChannel({
                name: 'testWHISPER',
                type: 'WHISPER',
                members: [idFriendSelected],
            }, selector.token);
            console.log('rep', rep.data);
            setIdChannel(rep.data.id);
            joinChannel(rep.data.id);
        }
    }
    function joinChannel(idChan) {
        console.log('idChan', idChan);
        socket.emit('joinChannel', {
            channelId: idChan
        });
    }
    useEffect(() => {
        if (selector.token) {
            const newSocket = io('http://localhost:3000', {
                transports: ['websocket'],
                extraHeaders: {
                    'Authorization': `Bearer ${selector.token}`
                }
            });
            setSocket(newSocket);
        }
    }, [setSocket, selector.token, idFriendSelected]);
    useEffect(() => {
        if (selector.id && socket) {
            creteOrJoinChannel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selector.id, idFriendSelected]);
    const messageListener = (message) => {
        console.log('Msg', message);
        if (message.length) {
            setMessages(message);
        }
        else {
            setMessages([...messages, message]);
        }
    };
    useEffect(() => {
        if (selector.id && socket) {
            socket.on('message', messageListener);
            return () => {
                socket.off('message', messageListener);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageListener, idFriendSelected]);
    function handleSubmit(e) {
        e.preventDefault();
        send(e.currentTarget.inputText.value);
    }
    return (React.createElement("div", { className: s.container },
        messages && React.createElement(Messages, { messages: messages, id: selector.id }),
        React.createElement("div", { className: s.inputBox },
            React.createElement("form", { onSubmit: handleSubmit },
                React.createElement("input", { name: 'inputText', className: s.input, placeholder: 'Type your message...' }),
                React.createElement("button", { type: 'submit' }, "Send")))));
}
