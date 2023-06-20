import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route }from 'react-router-dom'
import './index.css';
import App, { loader as appLoader, loader } from './routes/App/App';

import Login, { ChooseLogin, loader as loginLoader } from './routes/login/Login'
import SignIn from './routes/login/Signin';
import SignUp from './routes/login/Signup';
import Profile from './routes/Profile/Profile';
import LaunchGame from './routes/Game/Game';
import History from './routes/History/History';

import Interface from './routes/Chat/Interface/Interface';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import Chat from './routes/Chat/Chat/Chat';
import { CreateChannel } from './routes/Chat/CreateChannel';
import MenuElement from './routes/Chat/Menu/MenuElement';
<<<<<<< HEAD
import TwoFactor from './routes/login/2FA';
=======
import { UserProfile } from './routes/UserProfile/UserProfile';
import { Ladder } from './routes/Ladder/Ladder';
>>>>>>> 977302d362f2ff30c696af5ac69ab5b690069a9b


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
                path: "userprofile",
                element: <UserProfile id={2}/>
            },
			{
				path: "ladder",
				element: <Ladder />
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
                        path: "",
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <MenuElement />
                    },
                    {
                        path: "channel/create",
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <CreateChannel />
                    },
                    {
                        path: "channel/:channelId",
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <Interface />
                    },
                    {
                        path: "user/:userId",
                        errorElement: <Navigate to="/chat" replace/>,
                        element: <Interface />
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
            },
            {
                path: "2fa",
                element: <TwoFactor />,
            }
        ]
    },
    {
        path: "login:token",
        element: <Login />,
        loader: loginLoader
    },
])


const rootElement = document.getElementById("root");

if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
    <RouterProvider router={router} />
);
