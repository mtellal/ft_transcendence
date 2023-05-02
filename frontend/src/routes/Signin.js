import React from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";

import { extractCookie } from "../utils/Cookie";
import IconInput from "../components/IconInput";
import imgLogin from '../images/icon-login.png'

import { setCookie } from "../utils/Cookie";
import { loginRequest } from "../utils/User";

import '../styles/Sign.css'

/* export async function loader()
{
    setCookie("access_token")
    return (null)
}
 */

export default function SignIn(props) {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const navigate = useNavigate();

    async function handleResponse(res) {
        //console.log(res);
        if (!res.ok) {
            setError(`${res.status} ${res.statusText}`);
            return;
        }

        return (
            res.json()
            .then(d => d)
        )
    }

    async function handleSubmit() {
        if (!username || !password)
            return (setError("userame or password empty"))
        let res = await loginRequest(username, password);
        const token = await handleResponse(res);
        if (token)
        {
            setCookie("access_token", token.access_token)
            navigate("/");
        }
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
            <Outlet />
        </>
    )
}