import React from 'react';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import s from './style.module.css';
import { BackApi } from '../../api/back';
export function CreateGroup({ setBtnFriendsRequest }) {
    const selector = useSelector((store) => store.user.user);
    // const [Asocket, AsetSocket] = useState<any>(null);
    const [privacy, setPrivacy] = useState('Public');
    // const navigate = useNavigate();
    function handlePrivacyChange(e) {
        setPrivacy(e.target.value);
    }
    async function handleSubmit(e) {
        e.preventDefault();
        const target = e.target;
        if (e.target.privacy.value === 'Public') {
            await BackApi.createChannel({
                name: target.name.value,
                type: 'PUBLIC',
            }, selector.token);
        }
        else if (e.target.privacy.value === 'Private') {
            await BackApi.createChannel({
                name: target.name.value,
                type: 'PRIVATE',
            }, selector.token);
        }
        else {
            await BackApi.createChannel({
                name: target.name.value,
                type: 'PROTECTED',
                password: target.password.value
            }, selector.token);
        }
        setBtnFriendsRequest('GROUP');
        // navigate();
    }
    // useEffect(() => {
    // initializeSocket(selector.token);
    // AsetSocket(getSocket());
    // }, [])
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
