import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import SignIn from './routes/Signin';
import SignUp from './routes/Signup';
import Game from './components/Game';
import Profile from './routes/Profile';
import History from './routes/History';

import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';
import Chat from './routes/Chat';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "signin",
                element: <SignIn />,
            },
            {
                path: "signup",
                element: <SignUp />
            },
            {
                path: "game",
                element: <Game launch={false} />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "history",
                element: <History />
            },
            {
                path: "chat",
                element: <Chat />
            },

        ]
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
