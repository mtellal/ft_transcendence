import React from "react";
import { Link, redirect, useNavigate } from "react-router-dom";

import axios from 'axios';

import { extractCookie } from "../utils/Cookie";
import IconInput from "../components/IconInput";
import imgLogin from '../assets/icon-login.png'

import { setCookie } from "../utils/Cookie";
import { signinRequest } from "../utils/User";

import '../styles/Sign.css'

export async function loader()
{
    setCookie("access_token", "")
    return (null)
}

export default function SignIn(props) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!username || !password)
            return (setError("userame or password empty"));
        const res = await signinRequest(username, password);
        if (res && res.status === 200 && res.statusText === "OK")
        {
            setCookie("access_token", res.data.access_token);
            navigate("/", {user: res});
        }
        else
            setError(`${res.response.status} ${res.response.statusText}`);
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
                        submit={() => handleSubmit()}
                    />
                    <IconInput
                        icon="lock"
                        placeholder="Password"
                        getValue={value => setPassword(value)}
                        submit={() => handleSubmit()}
                    />
                    {error && <p>error: {error}</p>}
                    <Link
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
        </>
    )
}