import React from "react";
import { useNavigate } from "react-router-dom";

import { setCookie } from "../../Cookie";

import { signupRequest } from "../../requests/auth";
import { NavigationButton } from "./NavigationButton";
import arrowLeft from '../../assets/ ArrowLeft.svg'
import { LightInput } from "../../components/Input/LightInput";
import './Sign.css'


export default function SignUp() {
    const [username, setUsername]: [any, any] = React.useState("");
    const [password, setPassword]: [any, any] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError]: [any, any] = React.useState(false);

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!username || !username.trim()
            || !password || !password.trim()
            || !confirmPassword || !confirmPassword.trim())
            return (setError("userame or password empty"));
        if (username.trim().length > 20)
            return (setError("Username too long (max 20 charcters)"))
        if (password.trim().length > 30)
            return (setError("Password too long (max 30 charcters)"))
        if (password.trim() !== confirmPassword.trim())
            return (setError("password and confirm password are different"))
        await signupRequest(username.trim(), password.trim())
            .then(({ error, errMessage, res }: any) => {
                if (error)
                    setError(errMessage)
                else {
                    setCookie("access_token", res.data.access_token);
                    navigate("/");
                }
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
                <h2 className="reset login-title">Sign up</h2>
                <p className="reset login-description">Please sign up to continue</p>
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
                </div>
                <div style={{ paddingTop: '15px', paddingBottom: '20px' }}>
                    <LightInput
                        placeholder="confirm password"
                        value={confirmPassword}
                        setValue={setConfirmPassword}
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
                    mainTitle="Sign up"
                    secondTitle="sign in"
                    onClick={() => handleSubmit()}
                    path="/login/signin"
                />
            </div>
        </div>
    </div>
    )
}
