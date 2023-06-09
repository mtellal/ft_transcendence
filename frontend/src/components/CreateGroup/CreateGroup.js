import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { initializeSocket, getSocket } from '../../utils/socket';
import s from './style.module.css';
import { BackApi } from '../../api/back';
export function CreateGroup() {
    const selector = useSelector((store) => store.user.user);
    const [Asocket, AsetSocket] = useState(null);
    const [privacy, setPrivacy] = useState('Public');
    function handlePrivacyChange(e) {
        setPrivacy(e.target.value);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const target = e.target;
        if (e.target.privacy.value === 'Public') {
            const rep = await BackApi.createChannel({
                name: target.name.value,
                type: 'PUBLIC',
                // members: [selector.id],
            }, selector.token);
        }
        else if (e.target.privacy.value === 'Private') {
            const rep = await BackApi.createChannel({
                name: target.name.value,
                type: 'PRIVATE',
                // members: [selector.id],
            }, selector.token);
        }
        else {
            const rep = await BackApi.createChannel({
                name: target.name.value,
                type: 'PROTECTED',
                // members: [selector.id],
                password: target.password.value
            }, selector.token);
        }
    }
    useEffect(() => {
        initializeSocket(selector.token);
        AsetSocket(getSocket());
    }, []);
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
