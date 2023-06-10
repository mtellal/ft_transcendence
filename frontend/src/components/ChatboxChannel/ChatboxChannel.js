import React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BackApi } from '../../api/back';
import { Messages } from '../Messages/Messages';
import { getSocket } from '../../utils/socket';
import s from './style.module.css';
import { ChannelUsers } from '../ChannelUsers/ChannelUsers';
export function ChatboxChannel({ idChannelSelected, setidChannelSelected }) {
    const selector = useSelector((store) => store.user.user);
    const [Asocket, AsetSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [dataChannel, setDataChannel] = useState(null);
    const [rerender, setRerender] = useState(false);
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
            Asocket.emit('addtoChannel', {
                channelId: idChannelSelected,
                userId: rep.data.id,
            });
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
        else {
            setMessages([]);
        }
    }
    const messageListener = (message) => {
        console.log('MESSAGE', message);
        if (message.channelId === idChannelSelected) {
            if (message.length) {
                setMessages(message);
            }
            else {
                setMessages([...messages, message]);
            }
            if (message.type === 'NOTIF') {
                console.log('NOTIF');
                setRerender(!rerender);
            }
        }
    };
    const kickListenner = (message) => {
        if (message.channelId === idChannelSelected &&
            message.userId === selector.id) {
            setidChannelSelected(null);
        }
        else {
            getDataChannel();
        }
    };
    async function getDataChannel() {
        const rep = await BackApi.getChannelById(idChannelSelected);
        setDataChannel(rep.data);
    }
    function leaveChannel() {
        Asocket.emit('leaveChannel', {
            channelId: idChannelSelected,
        });
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
                Asocket.off('message', messageListener);
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messageListener, idChannelSelected]);
    useEffect(() => {
        AsetSocket(getSocket());
        getDataChannel();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [idChannelSelected, rerender]);
    return (React.createElement("div", { className: s.container },
        dataChannel && dataChannel.type === 'PRIVATE' && React.createElement("form", { onSubmit: invitUser },
            React.createElement("input", { name: 'invitUser', placeholder: 'Invit user' }),
            React.createElement("button", { type: 'submit' }, "Invit")),
        dataChannel && React.createElement(ChannelUsers, { dataChannel: dataChannel }),
        React.createElement("button", { onClick: leaveChannel }, "Leave channel"),
        messages && React.createElement(Messages, { messages: messages, id: selector.id }),
        React.createElement("div", { className: s.inputBox },
            React.createElement("form", { onSubmit: handleSubmit },
                React.createElement("input", { name: 'inputText', className: s.input, placeholder: 'Type your message...' }),
                React.createElement("button", { type: 'submit' }, "Send")))));
}
