import React from "react";
import { useNavigate } from "react-router-dom";
import { setCookie } from "../../Cookie";
import { signinRequest } from "../../requests/auth";

import { LightInput } from "../../components/Input/LightInput";
import { NavigationButton } from "./NavigationButton";
import arrowLeft from '../../assets/ ArrowLeft.svg'


import './Sign.css'

export default function SignIn() {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [error, setError] = React.useState("");

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
        await signinRequest(username.trim(), password.trim())
            .then(({ error, errMessage, res }: any) => {
                if (!error) {
                    handleResponse(res.data)
                }
                else
                    setError(errMessage)
            })
    }

    return (
        <div className="flex-center login-page">
            <div className="flex-column container-form">

                <img
                    className="pointer"
                    onClick={() => { navigate("/login") }}
                    style={{ width: '20px', paddingBottom: '10px'}}
                    src={arrowLeft}
                    alt="back to login"
                />

                <div className="reset fill">
                    <h2 className="reset login-title">Sign in</h2>
                    <p className="reset login-description">Please sign in to continue</p>
                </div>

                <div className="flex-column-center" style={{ padding: '0 10px' }}>
                    <div style={{ paddingTop: '15px' }}>
                        <LightInput
                            placeholder="username"
                            value={username}
                            setValue={setUsername}
                            onClick={() => handleSubmit()}
                            maxLength={20}
                        />
                    </div>
                    <div style={{ paddingTop: '15px' }}>
                        <LightInput
                            placeholder="password"
                            value={password}
                            setValue={setPassword}
                            onClick={() => handleSubmit()}
                            maxLength={30}
                        />
                        {
                            error &&
                            <p
                                className="reset login-font1"
                                style={{ paddingTop: '10px' }}
                            >
                                error: {error}
                            </p>
                        }
                    </div>
                </div>

                <div className="reset fill flex-column-center" style={{marginTop: 'auto'}}>
                    <NavigationButton
                        mainTitle="Sign in"
                        secondTitle="sign up"
                        onClick={() => handleSubmit()}
                        path="/login/signup"
                    />
                </div>
            </div>
        </div>
    )
}


