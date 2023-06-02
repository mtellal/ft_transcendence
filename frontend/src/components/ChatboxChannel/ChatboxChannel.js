import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import io from 'socket.io-client';
import s from './style.module.css';
export function ChatboxChannel({ idFriendSelected }) {
    console.log('id select friend', idFriendSelected);
    const selector = useSelector((store) => store.user.user);
    const [socket, setSocket] = useState();
    const [messages, setMessages] = useState([]);
    const send = (value) => {
        socket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idFriendSelected,
        });
    };
    function joinChannel() {
        socket.emit('joinChannel', {
            channelId: idFriendSelected
        });
    }
    async function invitUser(e) {
        e.preventDefault();
        const rep = await BackApi.getUserByUsername(e.currentTarget.invitUser.value);
        if (rep.status === 200) {
            console.log('User invite', rep.data.id);
            socket.emit('addtoChannel', {
                channelId: idFriendSelected,
                userId: rep.data.id,
            });
            console.log('FIN User invite');
        }
        else {
            console.log('err', rep.status);
        }
    }
    function handleSubmit(e) {
        e.preventDefault();
        send(e.currentTarget.inputText.value);
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
    }, [setSocket, selector.token]);
    useEffect(() => {
        if (selector.id && socket) {
            joinChannel();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [socket, selector.id]);
    const messageListener = (message) => {
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
    }, [messageListener]);
    return (React.createElement("div", { className: s.container },
        React.createElement("form", { onSubmit: invitUser },
            React.createElement("input", { name: 'invitUser', placeholder: 'Invit user' }),
            React.createElement("button", { type: 'submit' }, "Invit")),
        messages && React.createElement(Messages, { messages: messages, id: selector.id }),
        React.createElement("div", { className: s.inputBox },
            React.createElement("form", { onSubmit: handleSubmit },
                React.createElement("input", { name: 'inputText', className: s.input, placeholder: 'Type your message...' }),
                React.createElement("button", { type: 'submit' }, "Send")))));
}
