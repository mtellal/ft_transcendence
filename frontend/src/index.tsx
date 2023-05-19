import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route }from 'react-router-dom'
import './index.css';
import App, { loader as appLoader, loader } from './routes/App';


import Login, { ChooseLogin, loader as loginLoader } from './routes/login/Login'
import SignIn from './routes/login/Signin';
import SignUp from './routes/login/Signup';
import Profile from './routes/Profile';
import LaunchGame from './routes/Game';
import History from './routes/History';


import AddElement from "./Chat/Interface/AddElement";
import Interface, { loader as interfaceLoader} from './Chat/Interface/Interface';


import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import Chat from './routes/Chat';


const router = createBrowserRouter([
    {
        path: "/",
        loader: appLoader,
        element: <App />,
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
                element: <Chat />,
                errorElement: <Navigate to="/chat" replace/>,
                children: [
                    {
                        path: "add-friend",
                        loader: appLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <AddElement title="friend" />
                    },
                    {
                        path: "add-group",
                        loader: appLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <AddElement title="group" />
                    },
                    {
                        path: "groups/:groupid",
                        loader: interfaceLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <Interface friend={false} group={true}/>
                    },
                    {
                        path: "friends/:username/:id",
                        loader: interfaceLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element: <Interface friend={true} group={false}/>
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
                element: <ChooseLogin />,
            },
            {
                path: "signin",
                element: <SignIn />,
            },
            {
                path: "signup",
                element: <SignUp />,
            }
        ]
    },
    {
        path: "login:token",
        element: <Login />,
        loader: loginLoader
    }
])


const rootElement = document.getElementById("root");

if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
    <RouterProvider router={router} />
);
