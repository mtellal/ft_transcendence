import React from 'react';
import s from './style.module.css';
export function HeaderProfile({ selector }) {
    const image = selector.avatar;
    return (React.createElement("div", { className: s.container },
        selector.username,
        React.createElement("img", { className: s.image, src: image })));
}
