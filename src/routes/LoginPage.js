import React from "react";

import '../styles/Login.css'

import imgLogin from '../images/icon-login.png'

function IconInput(props)
{
    const [value, setValue] = React.useState("");

    const id = Math.floor(Math.random() * 10000);

    function handleChange(e)
    {
        setValue(e.target.value);
        if (props.getValue)
            props.getValue(e.target.value);
    }

    return (
        <label htmlFor={id} className="iconinput">
            <div className="iconinput--icon">
                <span className="material-symbols-outlined">
                    {props.icon}
                </span>
            </div>
            <input
                id={id} 
                value={value} 
                onChange={handleChange}
                className="inconinput--input" 
                placeholder={props.placeholder}

            />
        </label>
    )
}

function SingIn(props)
{
    function handleSubmit()
    {
        console.log("Sign in submit")
    }

    return (
        <>
            <img src={imgLogin} className="login--img" />
            <IconInput
                icon="person"
                placeholder="Username"
            />
            <IconInput
                icon="lock"
                placeholder="Password"
            />
            <button onClick={handleSubmit} className="login--button">Sign in</button>
            <p onClick={props.click} className="login--signin">Sign up</p>
        </>
    )
}

function SignUp(props)
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
        <>
            <img src={imgLogin} className="login--img" />
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

            <button className="login--button" onClick={submitForm} >Sign up</button>
            <p onClick={props.click} className="login--signin">Sign in</p>
        </>
    )
}

export default function Login(props)
{
    const [toggle, setToggle] = React.useState(true);

    function handleToggle()
    {
        setToggle(prev => !prev);
    }

    return (
        <div className="login">
            <div className="login--form">
                {toggle ? 
                    <SingIn click={handleToggle} /> :
                    <SignUp click={handleToggle} />}
            </div>
        </div>
    )
}