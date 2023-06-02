import React from 'react';
import { useState } from 'react';
import s from './style.module.css';
export function ProtectedChannelsList({ channel, socket }) {
    const [showPasswordInput, setShowPasswordInput] = useState(false);
    function joinChannel(e) {
        e.preventDefault();
        console.log('e.target.password.value', e.currentTarget.password.value);
        socket.emit('joinChannel', {
            channelId: channel.id,
            password: e.currentTarget.password.value
        });
    }
    return (React.createElement("div", { className: s.container },
        React.createElement("button", { onClick: () => setShowPasswordInput(!showPasswordInput) }, channel.name),
        showPasswordInput &&
            React.createElement("form", { onSubmit: joinChannel },
                React.createElement("input", { name: 'password', placeholder: 'Password' }),
                React.createElement("button", { type: 'submit' }, "Join channel"))));
}
