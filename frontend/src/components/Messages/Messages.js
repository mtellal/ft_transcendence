import React from 'react';
import s from './style.module.css';
export function Messages({ messages, id }) {
    return (React.createElement("div", { className: s.container }, messages.map((message) => {
        return (React.createElement("div", { className: s.boxMessage, key: message.id, style: {
                textAlign: message.sendBy === id ? 'right' : 'left',
            } },
            React.createElement("span", { className: s.message, style: {
                    backgroundColor: message.sendBy === id ? 'grey' : 'white'
                } }, message.content)));
    })));
}
