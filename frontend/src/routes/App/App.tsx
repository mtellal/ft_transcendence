import React from 'react'
import jwtDecode from 'jwt-decode';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';

import Header from './components/Header';
import Footer from './components/Footer';
import Sidebar from './components/SideBar';
import { extractCookie } from '../../Cookie';

import { getUser, getUserProfilePictrue } from '../../requests/user'

import { CurrentUserProvider } from '../../contexts/CurrentUserContext';
import defaultPP from '../../assets/user.png'
import { User } from '../../types';

import './App.css';

export async function loader() {
    let decodedToken = null;
    const token = extractCookie("access_token");
    if (token) {
        try {
            decodedToken = jwtDecode<any>(token);
        }
        catch (e) {
            return (redirect("/login"));
        }
    }
    if (decodedToken) {
        let userId: number = decodedToken.id;
        let err: boolean = false;
        let image: any = defaultPP;
        let user: User = null;

        await getUser(userId, token)
            .then(res => {
                if (res.status === 200 || res.statusText !== "OK")
                    user = res.data;
            })
            .catch(() => err = true)

        await getUserProfilePictrue(userId, token)
            .then(res => {
                if (res.status === 200 && res.statusText === "OK")
                    image = window.URL.createObjectURL(new Blob([res.data]))
            })
            .catch(() => err = true)

        if (!err)
            return ({ user: { ...user, url: image }, token })
    }
    return (redirect("/login"));
}

function App() {

    const { user, token }: any = useLoaderData();

    return (
        <CurrentUserProvider
            user={user}
            token={token}
        >
            <div className="App" >
                <Header />
                <Sidebar />
                <Outlet />
                <Footer />
            </div>
        </CurrentUserProvider>
    );
}

export default App;
