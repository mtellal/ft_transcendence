import React from "react";
import { Link } from "react-router-dom";

import '../styles/Sign.css'
import IconInput from "../components/IconInput";
import imgLogin from '../images/icon-login.png'

export default function SignIn(props)
{
    function handleSubmit()
    {
        console.log("SignIn submit")
    }

    return (
        <div className="sign-page">
            <div className="sign-form">
                <img src={imgLogin} className="sign--img" />
                <IconInput
                    icon="person"
                    placeholder="Username"
                />
                <IconInput
                    icon="lock"
                    placeholder="Password"
                />
                <Link
                    to={"/"}
                    className="sign--button"
                    onClick={handleSubmit}
                >
                    Sign in
                </Link>
                <Link
                    to={"/signup"}
                    className="sign--link"
                    onClick={props.click}
                >
                    Sign up
                </Link>
            </div>
        </div>
    )
}