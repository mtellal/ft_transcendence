import React, { useEffect } from "react";
import { Link, Outlet, redirect, useLocation, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { setCookie } from "../../Cookie";

import userImg from '../../assets/icon-login.png'

import './Sign.css'
import { getTokenRequest } from "../../requests/auth";


export function ChooseLogin() {
    const navigate = useNavigate();

    return (
        <div className="flex-column-center chooselogin-button-container">
            <a
                className="flex-center button chooselogin-button"
                onClick={() => navigate("/login/signin")}
            >
                Signin
            </a>

            <a
                className="flex-center button chooselogin-button"
                href={`${process.env.REACT_APP_BACK}/auth/42`}
            >
                Signin as <img className="chooselogin-img" src="./assets/42_Logo.svg" />
            </a>

            <a
                className="flex-center button chooselogin-button"
                onClick={() => navigate("/login/signup")}
            >
                Signup
            </a>
        </div>
    )
}


export default function Login() {

    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const navigate = useNavigate();

    async function loader() {
        let validLogin = false;
        let oauth_code = searchParams.get("oauth_code");
        let step = searchParams.get("step");
        if (oauth_code) {
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
        if (validLogin)
        {
            return (navigate("/"))
        }
    }


    useEffect(() => {
        loader();
    }, [])



    return (
        <div className="flex-center login-page">
            <div className="flex-column login-form relative">
                <img src={userImg} className="sign--img" />
                <Outlet />
            </div>
        </div>
    )
}
