import React from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";

import IconInput from "../../components/Input/IconInput";

import { setCookie } from "../../Cookie";

import './Sign.css'
import { signinRequest } from "../../requests/auth";

export default function SignIn() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!username || !password)
            return (setError("userame or password empty"));
        await signinRequest(username, password)
            .then(({ error, errMessage, res }: any) => {
                if (!error) {
                    setCookie("access_token", res.data.access_token);
                    navigate("/");
                }
                else
                    setError(errMessage)
            })
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


