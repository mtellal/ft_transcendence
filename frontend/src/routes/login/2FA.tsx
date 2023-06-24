import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import IconInput from "../../components/Input/IconInput";

import { setCookie } from "../../Cookie";

import './Sign.css'
import { getTokenRequest, signinRequest } from "../../requests/auth";
import { NavigationButton } from "./NavigationButton";

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


    async function submit() {
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
                            return ;
                        }
                    }
                    setError("Code invalid")
                })
        }
        else if (location.state.oauth_code && location.state.oauth_code.trim() ) {
            await getTokenRequest(location.state.oauth_code, secret.trim())
                .then(res => {
                    if (res && res.data) {
                        if (res.data.access_token) {
                            setCookie("access_token", res.data.access_token);
                            navigate("/");
                            return ;
                        }
                    }
                    setError("Code invalid")
                })
        }
    }

    const iconInputStyle = {
        height: '40px',
        width: '90%'
    }

    return (
        <div className="flex-column-center fill" style={{ width: '100%', height: '100%' }}>
            <div className="flex-center" style={{ paddingTop: '25%' }}>
                <IconInput
                    id="submit"
                    style={iconInputStyle}
                    icon="verified_user"
                    placeholder="Secret"
                    value={secret}
                    setValue={setSecret}
                    submit={() => submit()}
                    maxLength={30}
                />
            </div>
            {error && <p className="red-c">{error}</p>}
            <NavigationButton
                mainTitle="Login"
                secondTitle="Signin"
                path="/login/signin"
                onClick={() => submit()}
            />

        </div>
    )
}


