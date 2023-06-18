import React from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
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


export async function loader({ params, request }: any) {
    let validLogin = false;
    let url = request.url.split('oauth_code=');
    if (url && url.length > 1) {
        let oauth_code = decodeURI(url[1]);
        if (oauth_code) {
            await getTokenRequest(oauth_code, "wfw")
                .then(({ error, res }: any) => {
                    if (!error) {
                        setCookie("access_token", res.data.access_token);
                        validLogin = true;
                    }
                })
        }
    }
    else
        setCookie("access_token", "")
    if (validLogin)
        return (redirect("/"))
    return ({})
}

export default function Login() {

    return (
        <div className="flex-center login-page">
            <div className="flex-column login-form">
                <img src={userImg} className="sign--img" />
                <Outlet />
            </div>
        </div>
    )
}
