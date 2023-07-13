import React, { useEffect } from "react";
import { Outlet, useNavigate, useSearchParams } from "react-router-dom";
import { setCookie } from "../../Cookie";

import { getTokenRequest } from "../../requests/auth";

import './Sign.css'

export function ChooseLogin() {
    const navigate = useNavigate();

    return (
        <div className="flex-column-center chooselogin-button-container">
            <button
                className="flex-center button chooselogin-button"
                onClick={() => navigate("/login/signin")}
            >
                Signin
            </button>

            <a
                className="flex-center button chooselogin-button"
                href={`${process.env.REACT_APP_BACK}/auth/42`}
            >
                Signin as <img alt="42" className="chooselogin-img" src="./assets/42_Logo.svg" />
            </a>

            <button
                className="flex-center button chooselogin-button"
                onClick={() => navigate("/login/signup")}
            >
                Signup
            </button>
        </div>
    )
}


export default function Login() {

    const [searchParams, setSearchParams]: any = useSearchParams();

    const navigate = useNavigate();

    async function loader() {
        let validLogin = false;
        let oauth_code = searchParams.get("oauth_code");
        if (oauth_code) {
            let step = searchParams.get("step");
            if (step === "true") {
                return (navigate("/login/2fa", { state: { oauth_code } }));
            }
            if (oauth_code) {
                await getTokenRequest(oauth_code, "")
                    .then(res => {
                        if (res && res.data) {
                            setCookie("access_token", res.data.access_token);
                            validLogin = true;
                        }
                    })
            }
        }
        else
            setCookie("access_token", "")
        if (validLogin) {
            return (navigate("/"))
        }
    }

    useEffect(() => {
        loader();
    }, [])

    return (
        <div className="flex-center login-page">
            <div className="flex-column container-form">

                <div className="reset fill login-title-container">
                    <h2 className="reset login-title">Login</h2>
                    <p className="reset login-description">Please sign in to continue</p>
                </div>

                <div className=" reset fill flex-column-center">
                    <button
                        className="flex-center button chooselogin-button button-font"
                        onClick={() => navigate("/login/signin")}
                    >
                        Signin
                    </button>

                    <a
                        className="flex-center button chooselogin-button"
                        href={`${process.env.REACT_APP_BACK}/auth/42`}
                    >
                        Signin as <img alt="42" className="chooselogin-img" src="./assets/42_Logo.svg" />
                    </a>

                    <button
                        className="flex-center button chooselogin-button"
                        onClick={() => navigate("/login/signup")}
                    >
                        Signup
                    </button>
                </div>
            </div>
        </div>
    )
}
