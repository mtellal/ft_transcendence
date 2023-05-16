import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

import IconInput from "../../Components/IconInput";
import { signupRequest } from "../../utils/User";
import { setCookie } from "../../utils/Cookie";

import './Sign.css'


export default function SignUp()
{
    const [username, setUsername] : [any, any] = React.useState("");
    const [password, setPassword] : [any, any]= React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError] : [any, any] = React.useState(false);

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!username || !password || !confirmPassword)
            return (setError("userame or password empty"));
        if (password !== confirmPassword)
            return (setError("password !== confirm password"))
        const res = await signupRequest(username, password);

        if (res && res.status === 201 && res.statusText === "Created")
        {
            setCookie("access_token", res.data.access_token);
            navigate("/login/signin");
        }
        else
            setError(`${res.response.status} ${res.response.statusText}`);
    }

    const iconInputStyle = {
        height: '40px',
        width: '90%'
    }

    return (
        <div className="flex-column-center login-form-container">
                <IconInput
                    style={iconInputStyle}
                    icon="person"
                    placeholder="Username"
                    getValue={(value : string) => setUsername(value)}
                    submit={handleSubmit}
                    />
                <IconInput
                    style={iconInputStyle}
                    icon="lock"
                    placeholder="Password"
                    getValue={(value : string) => setPassword(value)}
                    submit={handleSubmit}
                    />
                <IconInput
                    style={iconInputStyle}
                    icon="lock"
                    placeholder="Confirm password"
                    getValue={(value : string) => setConfirmPassword(value)}
                    submit={handleSubmit}
                    />
                {error && <p>error: {error}</p>}
                <button 
                    className="sign--button" 
                    onClick={handleSubmit} 
                    >
                    Sign up
                </button>
                <Link
                    to={"/login/signin"}
                    className="sign--link"
                    >
                    Sign in
                </Link>
        </div>
    )
}