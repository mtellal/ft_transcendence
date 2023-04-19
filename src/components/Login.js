import React from "react";

import '../styles/Login.css'

import imgLogin from '../images/icon-login.png'

function IconInput(props)
{
    return (
        <div className="iconinput">
            <div className="iconinput--icon">
                <span className="material-symbols-outlined">
                    {props.icon}
                </span>
            </div>
            <input className="inconinput--input" placeholder={props.placeholder} />
        </div>
    )
}


export default function Login(props)
{
    return (
        <div className="login">
            <div className="login--form">
                <img src={imgLogin} className="login--img" />
                <IconInput icon="person" placeholder="Username" />
                <IconInput icon="lock" placeholder="Password" />

                <button className="login--button">Sign in</button>
                <p className="login--signin">Sign Up</p>
            </div>
        </div>
    )
}