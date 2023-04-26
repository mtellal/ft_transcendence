import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import SignIn from './routes/Signin';
import SignUp from './routes/Signup';
import Game from './components/Game';
import Profile from './routes/Profile';
import History from './routes/History';

import AddElement from "./components/Chat/AddElement";

import { currentUser as user } from './exampleDatas'

import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';

import Chat, { ChatRoute } from './routes/Chat';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App user={user} />,
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
                element: <Chat user={user} />,
                children: [
                    {
                        path: "add-friend",
                        element:  <AddElement user={user} title="friend" />
                    },
                    {
                        path: "add-group",
                        element:  <AddElement user={user} title="group" />
                    }
                ]
            },
            {
                path: "chat/groups/:id",
                element: <Chat user={user} />
            },
            {
                path: "chat/friends/:id",
                element: <Chat user={user} />
            }
        ]
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
