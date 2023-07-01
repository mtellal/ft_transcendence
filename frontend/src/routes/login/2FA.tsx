import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { setCookie } from "../../Cookie";

import { getTokenRequest, signinRequest } from "../../requests/auth";
import { NavigationButton } from "./NavigationButton";
import arrowLeft from '../../assets/ ArrowLeft.svg'
import { LightInput } from "../../components/Input/LightInput";

import './Sign.css'

export default function TwoFactor() {
    const [secret, setSecret] = React.useState("");
    const [error, setError] = React.useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location || !location.state) {
            navigate("/signin")
        }
    }, [location, navigate])


    async function handleSubmit() {
        if (!secret || !secret.trim())
            return setError("Secret required")
        if (location.state.username && location.state.username.trim() &&
            location.state.password && location.state.password.trim()) {
            await signinRequest(location.state.username.trim(), location.state.password.trim(), secret.trim(), "true")
                .then(({ res }: any) => {
                    if (res && res.data) {
                        if (res.data.access_token) {
                            setCookie("access_token", res.data.access_token);
                            navigate("/");
                            return;
                        }
                    }
                    setError("Code invalid")
                })
        }
        else if (location.state.oauth_code && location.state.oauth_code.trim()) {
            await getTokenRequest(location.state.oauth_code, secret.trim())
                .then(res => {
                    if (res && res.data) {
                        if (res.data.access_token) {
                            setCookie("access_token", res.data.access_token);
                            navigate("/");
                            return;
                        }
                    }
                    setError("Code invalid")
                })
        }
    }

    return (
        <div className="flex-center login-page">
            <div className="flex-column container-form">

                <img
                    className="pointer"
                    onClick={() => { navigate("/login") }}
                    style={{ width: '20px', paddingBottom: '10px' }}
                    src={arrowLeft}
                    alt="back to login"
                />

                <div className="reset fill">
                    <h2 className="reset login-title">2FA</h2>
                    <p className="reset login-description">Verify your secret code to continue</p>
                </div>

                <div className="flex-column-center" style={{ padding: '0 10px' }}>
                    <div style={{ paddingTop: '30px' }}>
                        <LightInput
                            placeholder="secret code"
                            value={secret}
                            setValue={setSecret}
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

                <div className="reset fill flex-column-center" style={{ marginTop: 'auto' }}>
                    <NavigationButton
                        mainTitle="Login"
                        secondTitle="sign in"
                        path="/login/signin"
                        onClick={() => handleSubmit()}
                    />
                </div>
            </div>
        </div>
    )
}


