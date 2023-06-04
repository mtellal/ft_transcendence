import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HeaderProfile } from '../HeaderProfile/HeaderProfile';
import { initializeSocket } from '../../utils/socket';
import s from './style.module.css';
export function Header() {
    const navigate = useNavigate();
    const selector = useSelector((store) => store.user.user);
    useEffect(() => {
        if (selector.token) {
            initializeSocket(selector.token);
        }
    }, [selector.token]);
    return (React.createElement("div", { className: s.container },
        React.createElement("ul", { className: s.tabs },
            React.createElement("li", { className: s.element, onClick: () => navigate('/signin') }, "Game"),
            React.createElement("li", { className: s.element, onClick: () => navigate('/profile') }, "Profile"),
            React.createElement("li", { className: s.element, onClick: () => navigate('/chat') }, "Chat"),
            React.createElement("li", { className: s.element }, selector.username)),
        React.createElement("span", { className: s.profileInfos },
            React.createElement(HeaderProfile, { selector: selector }))));
}
