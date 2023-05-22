import React from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";
import { setCookie } from "../../utils/Cookie";

import userImg from '../../assets/icon-login.png'

import './Sign.css'


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
        </div>
    )
}


export async function loader({ params, request }: any) {
    let url = request.url.split('token=');
    if (url.length > 1) {
        let data = JSON.parse(decodeURI(url[1]));
        if (data.access_token) {
            setCookie("access_token", data.access_token);
            return (redirect("/"));
        }
    }
    else
        setCookie("access_token", "")
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
