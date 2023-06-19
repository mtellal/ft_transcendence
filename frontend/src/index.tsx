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


import AddFriend from "./routes/Chat/AddFriend/AddFriend";
import Interface from './routes/Chat/Interface/Interface';
import { CreateChannel } from './routes/Chat/AddChannel/CreateChannel';


import {
    createBrowserRouter,
    RouterProvider,
} from 'react-router-dom';

import Chat from './routes/Chat/Chat/Chat';
import JoinChannel from './routes/Chat/AddChannel/JoinChannel';
import AddChannel from './routes/Chat/AddChannel/AddChannel';
import { UserProfile } from './routes/UserProfile/UserProfile';
import { Ladder } from './routes/Ladder/Ladder';


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
                element: <UserProfile id={3}/>
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
                        path: "add-friend",
                        loader: appLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <AddFriend/>
                    },
                    {
                        path: "add-group",
                        loader: appLoader,
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <AddChannel />
                    },
                    {
                        path: "add-group/join",
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <JoinChannel />
                    },
                    {
                        path: "add-group/create",
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <CreateChannel />
                    },
                    {
                        path: "groups/:channelName",
                        errorElement: <Navigate to="/chat" replace/>,
                        element:  <Interface />
                    },
                    {
                        path: "friends/:username/:id",
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

