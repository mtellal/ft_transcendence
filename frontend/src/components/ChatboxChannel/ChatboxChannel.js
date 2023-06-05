import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import { getSocket } from '../../utils/socket';
import s from './style.module.css';
export function ChatboxChannel({ idChannelSelected }) {
    console.log('id select friend', idChannelSelected);
    const selector = useSelector((store) => store.user.user);
    const [Asocket, AsetSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const send = (value) => {
        Asocket.emit('message', {
            sendBy: selector.id,
            content: value,
            channelId: idChannelSelected,
        });
    };
    function joinChannel() {
        Asocket.emit('joinChannel', {
            channelId: idChannelSelected
        });
    }
    async function invitUser(e) {
        e.preventDefault();
        const rep = await BackApi.getUserByUsername(e.currentTarget.invitUser.value);
        if (rep.status === 200) {
            console.log('User invite', rep.data.id);
            Asocket.emit('addtoChannel', {
                channelId: idChannelSelected,
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
    async function getMessages(id) {
        const rep = await BackApi.getChannelMessagesById(id);
        if (rep.status === 200) {
            setMessages(rep.data);
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
    }, [Asocket, selector.id]);
    const messageListener = (message) => {
        if (message.channelId === idChannelSelected) {
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
    }, [messageListener]);
    useEffect(() => {
        AsetSocket(getSocket());
    }, []);
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
