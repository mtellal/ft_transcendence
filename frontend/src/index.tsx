import React from 'react';
import ReactDOM from 'react-dom/client';
import { Navigate, Route }from 'react-router-dom'
import App, { loader as appLoader, loader } from './routes/App/App';

import './index.css';
import Login, { ChooseLogin } from './routes/login/Login'
import SignIn from './routes/login/Signin';
import SignUp from './routes/login/Signup';
import Profile, {PageInformations} from './routes/Profile/Profile';
import Settings from './routes/Profile/Settings';
import LaunchGame from './routes/Game/LaunchGame';

import Interface from './routes/Chat/Interface/Interface';

import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import Chat from './routes/Chat/Chat/Chat';
import { CreateChannel } from './routes/Chat/CreateChannel';
import MenuElement from './routes/Chat/Menu/MenuElement';
import TwoFactor from './routes/login/2FA';
import { UserProfile } from './routes/UserProfile/UserProfile';
import { Ladder } from './routes/Ladder/Ladder';


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        loader: appLoader,
        errorElement: <Navigate to="/" replace/>,
        children: [
            {
                path: "",
                element: <LaunchGame />
            },
            {
                path: "/ladder",
                element: <Ladder />
            },
            {
                path: "profile",
                element: <Profile />,
                children: [
                    {
                        path: "",
                        element: <PageInformations />
                    },
                    {
                        path: "settings",
                        element: <Settings />
                    }
                ]
            },
			{
                path: "user/:userId",
                element: <UserProfile />
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
    },
    {
        path: "login/signin",
        element: <SignIn />,
    },
    {
        path: "login/signup",
        element: <SignUp />,
    },
    {
        path: "login/2fa",
        element: <TwoFactor />,
    }
])


const rootElement = document.getElementById("root");

if (!rootElement) throw new Error('Failed to find the root element');

const root = ReactDOM.createRoot(rootElement);
root.render(
    <RouterProvider router={router} />
);
