import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route }from 'react-router-dom'
import './index.css';
import App, { loader as appLoader } from './App';


import Login, { ChooseLogin, loader as loginLoader } from './routes/login/Login'
import SignIn from './routes/login/Signin';
import SignUp from './routes/login/Signup';
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
        errorElement: <Navigate to="/" replace/>,
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
                errorElement: <Navigate to="/chat" replace/>,
                children: [
                    {
                        path: "add-friend",
                        loader: appLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <AddElement user={user} title="friend" />
                    },
                    {
                        path: "add-group",
                        loader: appLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <AddElement user={user} title="group" />
                    },
                    {
                        path: "groups/:groupid",
                        loader: interfaceLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <Interface user={user} group={true}/>
                    },
                    {
                        path: "friends/:username/:id",
                        loader: interfaceLoader,
                        errorElement: <Navigate to="/chat" replace/>,
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
        errorElement: <Navigate to="/login" replace/>,
        children: [
            {
                path: "",
                element: <ChooseLogin />,
                errorElement: <Navigate to="/login" replace/>,
            },
            {
                path: "signin",
                element: <SignIn />,
                errorElement: <Navigate to="/login" replace/>,
            },
            {
                path: "signup",
                element: <SignUp />,
                errorElement: <Navigate to="/login" replace/>,
            }
        ]
    }
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
