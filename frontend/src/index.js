import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, { loader as appLoader } from './App';


import Login, { ChooseLogin, loader as loginLoader } from './routes/login/Login'
import SignIn from './routes/Signin';
import SignUp from './routes/Signup';
import Profile from './routes/Profile';
import LaunchGame from './routes/Game';
import History from './routes/History';



import AddElement from "./Chat/Interface/AddElement";
import Interface, { loader as interfaceLoader} from './Chat/Interface/Interface';


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
                loader: appLoader,
                element: <LaunchGame />
            },
            {
                path: "profile",
                element: <Profile />
            },
            {
                path: "game",
                loader: appLoader,
                element: <LaunchGame />
            },
            {
                path: "history",
                loader: appLoader,
                element: <History />
            },
            {
                path: "chat",
                element: <Chat user={user} />,
                children: [
                    {
                        path: "add-friend",
                        loader: appLoader,
                        element:  <AddElement user={user} title="friend" />
                    },
                    {
                        path: "add-group",
                        loader: appLoader,
                        element:  <AddElement user={user} title="group" />
                    },
                    {
                        path: "groups/:groupid",
                        loader: interfaceLoader,
                        element:  <Interface user={user} group={true}/>
                    },
                    {
                        path: "friends/:username/:id",
                        loader: interfaceLoader,
                        element: <Interface user={user} friend={true}/>
                    }
                ]
            },
        ]
    },
    {
        path: "login",
        element: <Login />,
        loader: loginLoader,
        children: [
            {
                path: "",
                element: <ChooseLogin />
            },
            {
                path: "signin",
                element: <SignIn />
            },
            {
                path: "signup",
                element: <SignUp />,
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
