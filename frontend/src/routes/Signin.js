import React from "react";
import { Link, Outlet } from "react-router-dom";

import '../styles/Sign.css'
import IconInput from "../components/IconInput";
import imgLogin from '../images/icon-login.png'


export default function SignIn(props)
{
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");


    function handleSubmit()
    {
        /* let user = fetch('http://localhost:3000/users', {
            method: "POST",
            headers: {'Content-type':"application/json"},
            body: JSON.stringify({
                id: Math.floor(Math.random() * 1000),
                username: username,
                avatar: JSON.stringify(imgLogin)
            })
        })
        .then(res => res.json())
        .then(datas => console.log(datas))
        .catch(e => console.log(e)) */

        console.log("SignIn submit")
    }

    return (
        <>
        <div className="sign-page">
            <div className="sign-form">
                <img src={imgLogin} className="sign--img" />
                <IconInput
                    icon="person"
                    placeholder="Username"
                    getValue={value => setUsername(value)}
                />
                <IconInput
                    icon="lock"
                    placeholder="Password"
                    getValue={value => setPassword(value)}
                    />
                <Link
                    to="/"
                    className="sign--button"
                    onClick={handleSubmit}
                    >
                    Sign in
                </Link>
                <Link
                    to={"/signup"}
                    className="sign--link"
                    onClick={props.click}
                    >
                    Sign up
                </Link>
            </div>
        </div>
        <Outlet />
        </>
    )
}