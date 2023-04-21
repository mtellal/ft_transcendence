import React from "react";
import { Link } from "react-router-dom";

import '../styles/Sign.css'
import IconInput from "../components/IconInput";
import imgLogin from '../images/icon-login.png'

export default function SignUp(props)
{
    const [formError, setFormError] = React.useState(false);

    function getValue(value)
    {
        console.log(value)
    }

    function submitForm()
    {
        console.log("SignUp submit")
    }

    return (
        <div className="sign-page">
            <div className="sign-form">
                <img src={imgLogin} className="sign--img" />
                <IconInput
                    getValue={getValue}
                    icon="person"
                    placeholder="Username"
                />
                <IconInput
                    getValue={getValue}
                    icon="lock"
                    placeholder="Password"
                />
                <IconInput
                    getValue={getValue}
                    icon="lock"
                    placeholder="Confirm password"
                />

                <button className="sign--button" onClick={submitForm} >Sign up</button>
                <Link
                    to={"/signin"}
                    className="sign--link"
                >
                    Sign in
                </Link>
            </div>
        </div>
    )
}