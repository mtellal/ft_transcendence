import React from "react";
import { Link, Outlet, redirect, useNavigate } from "react-router-dom";

import axios from 'axios';

import { setCookie } from "../../utils/Cookie";

import userImg from '../../assets/icon-login.png'

import './Sign.css'


export function ChooseLogin()
{
    const navigate = useNavigate();

    async function load()
    {
        const res = await fetch("http://localhost:3000/auth/42", {redirect:'follow', mode:'cors'})
            .then(res => {
                if (res.redirected)
                    window.location.href = res.url;
            })
            .catch(err => err)
        console.log(res);
    }


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
                onClick={() => load()}
            >
                Signin as <img className="chooselogin-img" src="./assets/42_Logo.svg"/>
            </button>
        </div>
    )
}


export async function loader({params} : any)
{
    console.log("param => ", params)
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
