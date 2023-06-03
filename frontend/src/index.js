import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Signup } from './routes/Signup/Signup';
import { Signin } from './routes/Signin/Signin';
import { Profile } from './routes/Profile/Profile';
import { Provider } from 'react-redux';
import store from './store/index';
import { Chat } from './routes/Chat/Chat';
import './global.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(Provider, { store: store },
    React.createElement(BrowserRouter, null,
        React.createElement(Routes, null,
            React.createElement(Route, { path: '/', element: React.createElement(App, null) },
                React.createElement(Route, { path: '/profile', element: React.createElement(Profile, null) }),
                React.createElement(Route, { path: '/chat', element: React.createElement(Chat, null) })),
            React.createElement(Route, { path: '/signup', element: React.createElement(Signup, null) }),
            React.createElement(Route, { path: '/signin', element: React.createElement(Signin, null) })))));
