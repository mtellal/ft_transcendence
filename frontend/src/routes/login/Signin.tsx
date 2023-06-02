import React from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";

import IconInput from "../../components/Input/IconInput";

import { setCookie } from "../../utils/Cookie";
import { signinRequest } from "../../utils/User";

import './Sign.css'

export default function SignIn()
{
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
            navigate("/");
        }
        else
        {
            setError(`${res.response.status} ${res.response.statusText}`);
            console.log(res)
        }
    }

    const iconInputStyle = {
        height: '40px',
        width: '90%'
    }


    return (
        <div className="flex-column-center login-form-container">
            <IconInput
                id="submit"
                style={iconInputStyle}
                icon="person"
                placeholder="Username"
                value={username}
                setValue={setUsername}
                submit={() => handleSubmit()}
            />
            <IconInput
                id="password"
                style={iconInputStyle}
                icon="lock"
                placeholder="Password"
                value={password}
                setValue={setPassword}
                submit={() => handleSubmit()}
            />
            {error && <p>error: {error}</p>}
            <button
                className="flex-center sign--button"
                onClick={handleSubmit}
            >
                Sign in
            </button>
            <Link
                to={"/login/signup"}
                className="sign--link"
            >
                Sign up
            </Link>
        </div>
    )
}


