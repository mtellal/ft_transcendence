import React, { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import IconInput from "../../components/Input/IconInput";
import { setCookie } from "../../Cookie";
import { getTokenRequest, signinRequest } from "../../requests/auth";

import './Sign.css'

export default function SignIn() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");
    const [secret, setSecret] = useState("");

    const navigate = useNavigate();

    async function handleResponse(data: any) {
        if (data) {
            if (!data || !data.access_token) {
                navigate("/login/2fa", { state: { username, password } })
            }
            else if (data.access_token) {
                setCookie("access_token", data.access_token);
                navigate("/");
            }
        }
    }

    async function handleSubmit() {
        if (!username || !username.trim()
            || !password || !password.trim())
            return (setError("userame or password empty"));
        await signinRequest(username, password)
            .then(({ error, errMessage, res }: any) => {
                if (!error) {
                    handleResponse(res.data)
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
        <div className="flex-column-center" style={{ minHeight: '250px' }}>
            <div className="flex-column-center " style={{ minHeight: '150px' }}>
                <IconInput
                    id="submit"
                    style={iconInputStyle}
                    icon="person"
                    placeholder="Username"
                    value={username}
                    setValue={setUsername}
                    submit={() => handleSubmit()}
                    maxLength={20}
                />
                <IconInput
                    id="password"
                    style={iconInputStyle}
                    icon="lock"
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    submit={() => handleSubmit()}
                    maxLength={30}
                />
            </div>
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


