import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import { getSocket } from '../../utils/socket';
import s from './style.module.css';
export function Chatbox({ idFriendSelected }) {
    const selector = useSelector((store) => store.user.user);
    const [Asocket, AsetSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [idChannel, setIdChannel] = useState();
    const send = (value) => {
        Asocket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idChannel,
        });
    };
    async function creteOrJoinChannel() {
        const response = await BackApi.getWhispers(selector.id, idFriendSelected);
        if (response.status === 200) {
            console.log('Chennel exist');
            setMessages([]);
            setIdChannel(response.data.id);
            joinChannel(response.data.id);
            return response.data.id;
        }
        else {
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
    function joinChannel(idChan) {
        console.log('idChan', idChan);
        Asocket.emit('joinChannel', {
            channelId: idChan
        });
    }
    async function getMessages(id) {
        const rep = await BackApi.getChannelMessagesById(id);
        if (rep.status === 200) {
            setMessages(rep.data);
        }
    }
    useEffect(() => {
        AsetSocket(getSocket());
    }, []);
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
    const messageListener = (message) => {
        if (message.channelId === idChannel) {
            if (message.length) {
                setMessages(message);
            }
            else {
                setMessages([...messages, message]);
            }
        }
    };
    useEffect(() => {
        if (selector.id && Asocket) {
            Asocket.on('message', messageListener);
            return () => {
                Asocket.off('message', messageListener);
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
