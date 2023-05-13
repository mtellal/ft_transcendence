import React from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";

import { setCookie } from "../../utils/Cookie";

import userImg from '../../assets/icon-login.png'

import '../../styles/Sign.css'


export function ChooseLogin()
{
    const navigate = useNavigate();

    return (
        <div className="flex-column-center chooselogin-button-container">
            <button 
                className="flex-center button chooselogin-button"
                onClick={() => navigate("/login/signin")}
            >
                Signin
            </button>

            <button 
                className="flex-center button chooselogin-button"
                onClick={() => null}
            >
                Signin as <img className="chooselogin-img" src="./assets/42_Logo.svg"/>
            </button>
        </div>
    )
}


export async function loader()
{
    setCookie("access_token", "")
    return (null)
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
