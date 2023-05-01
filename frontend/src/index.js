import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { loader as appLoader } from './App';

import SignIn from './routes/Signin';
import SignUp from './routes/Signup';
import Game from './components/Game';
import Profile from './routes/Profile';
import History from './routes/History';
import LaunchGame from './components/Game';



import AddElement from "./components/Chat/Interface/AddElement";
import Interface, { loader as interfaceLoader}from './components/Chat/Interface/Interface';


import { currentUser as user } from './exampleDatas'

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import Chat from './routes/Chat';


const router = createBrowserRouter([
    {
        path: "/",
        loader: appLoader,
        element: <App user={user} />,
        children: [
            {
                path: "",
                element: <LaunchGame />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "game",
                element: <LaunchGame />
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
                    },
                    {
                        path: "groups/:groupid",
                        loader: interfaceLoader,
                        element:  <Interface user={user} group={true}/>
                    },
                    {
                        path: "friends/:friendid",
                        loader: interfaceLoader,
                        element: <Interface user={user} friend={true}/>
                    }
                ]
            },
        ]
    },
    {
        path: "/signin",
        element: <SignIn />,
        children: [
            {
                path: "",
                element: <App />
            }
        ]
    },
    {
        path: "/signup",
        element: <SignUp />,
        children: [
            {
                path: "",
                element: <App />
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
