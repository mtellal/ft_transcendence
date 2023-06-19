import React, { useEffect } from "react";
import { Link, Outlet, redirect, useLoaderData, useLocation, useNavigate } from "react-router-dom";

import IconInput from "../../components/Input/IconInput";

import { setCookie } from "../../Cookie";

import './Sign.css'
import { signinRequest } from "../../requests/auth";

export default function TwoFactor() {
    const [secret, setSecret] = React.useState("");
    const [error, setError] = React.useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!location || !location.state) {
            navigate("/signin")
        }
        else
            console.log("2FA CORRECT", location.state)
    }, [location])



    async function submit() {
        if (!secret || !secret.trim())
            return setError("Secret required")
        console.log(secret.trim())
        await signinRequest(location.state.username, location.state.password, secret, "true")
            .then(({ res }: any) => {
                console.log(res)
                if (res && res.data) {
                    if (res.data.access_token) {
                        setCookie("access_token", res.data.access_token);
                        navigate("/");
                    }
                }
            })
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
                />
            </div>
            {error && <p className="red-c">{error}</p>}
            <div className="flex-column-center" style={{ width: '100%', marginTop: 'auto' }}>
                <button
                    className="flex-center sign--button"
                    onClick={() => submit()}
                >
                    Valid
                </button>
                <Link
                    to={"/login/signin"}
                    className="sign--link"
                >
                    Signin
                </Link>
            </div>
        </div>
    )
}


