import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import SignIn from './routes/Signin';
import SignUp from './routes/Signup';
import Game from './components/Game';
import Profile from './components/Profile';

import {
    createBrowserRouter,
    RouterProvider
} from 'react-router-dom';


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
            }
        ]
    },
])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <RouterProvider router={router} />
);
