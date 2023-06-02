import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import s from './style.module.css';
export function CreateGroup() {
    const selector = useSelector((store) => store.user.user);
    const [socket, setSocket] = useState(null);
    const [privacy, setPrivacy] = useState('Public');
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
    function handlePrivacyChange(e) {
        setPrivacy(e.target.value);
    }
    function handleSubmit(e) {
        const target = e.target;
        e.preventDefault();
        if (e.target.privacy.value === 'Public') {
            socket.emit('createChannel', {
                name: target.name.value,
                type: "PUBLIC",
            });
        }
        else if (e.target.privacy.value === 'Private') {
            socket.emit('createChannel', {
                name: target.name.value,
                type: "PRIVATE",
            });
        }
        else {
            socket.emit('createChannel', {
                name: target.name.value,
                type: "PROTECTED",
                password: e.target.password.value
            });
        }
    }
    return (React.createElement("div", null,
        React.createElement("form", { className: s.container, onSubmit: handleSubmit },
            "Channel name",
            React.createElement("input", { name: 'name', placeholder: 'Name' }),
            "Privacy",
            React.createElement("select", { name: 'privacy', onChange: handlePrivacyChange },
                React.createElement("option", null, "Public"),
                React.createElement("option", null, "Protected"),
                React.createElement("option", null, "Private")),
            privacy === 'Protected' && React.createElement("input", { placeholder: 'password', type: 'password', name: 'password' }),
            React.createElement("button", { type: 'submit' }, "Create channel"))));
}
