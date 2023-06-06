import React, { useEffect, useRef } from 'react';
import s from './style.module.css';
export function Messages({ messages, id }) {
    const messagesContainerRef = useRef(null);
    useEffect(() => {
        const messageContainer = messagesContainerRef.current;
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, [messages]);
    return (React.createElement("div", { className: s.container, ref: messagesContainerRef }, messages.map((message) => {
        return (React.createElement("div", { className: s.boxMessage, key: message.id, style: {
                textAlign: message.sendBy === id ? 'right' : 'left',
            } },
            React.createElement("span", { className: s.message, style: {
                    backgroundColor: message.sendBy === id ? 'grey' : 'white'
                } }, message.content)));
    })));
}
