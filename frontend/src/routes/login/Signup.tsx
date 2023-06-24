import React from "react";
import { useNavigate } from "react-router-dom";

import IconInput from "../../components/Input/IconInput";
import { setCookie } from "../../Cookie";

import './Sign.css'
import { signupRequest } from "../../requests/auth";
import { NavigationButton } from "./NavigationButton";


export default function SignUp() {
    const [username, setUsername]: [any, any] = React.useState("");
    const [password, setPassword]: [any, any] = React.useState("");
    const [confirmPassword, setConfirmPassword] = React.useState("");
    const [error, setError]: [any, any] = React.useState(false);

    const navigate = useNavigate();

    async function handleSubmit() {
        if (!username || !username.trim()
            || !password || !password.trim()
            || !confirmPassword || !confirmPassword.trim())
            return (setError("userame or password empty"));
        if (username.trim().length > 20)
            return (setError("Username too long (max 20 charcters)"))
        if (password.trim().length > 30)
            return (setError("Password too long (max 30 charcters)"))
        if (password !== confirmPassword)
            return (setError("password and confirm password are different"))
        await signupRequest(username, password)
            .then(({ error, errMessage, res }: any) => {
                if (error)
                    setError(errMessage)
                else {
                    setCookie("access_token", res.data.access_token);
                    navigate("/");
                }
            })

    }

    const iconInputStyle = {
        height: '40px',
        width: '90%'
    }

    return (
        <div className="flex-column-center" style={{ justifyContent: 'space-around', marginBottom: '60px' }}>
            <div className="flex-column-center">
                <IconInput
                    id="signup-username"
                    style={iconInputStyle}
                    icon="person"
                    placeholder="Username"
                    value={username}
                    setValue={setUsername}
                    submit={handleSubmit}
                    maxLength={20}
					password={false}
                />
                <IconInput
                    id="signup-password"
                    style={iconInputStyle}
                    icon="lock"
                    placeholder="Password"
                    value={password}
                    setValue={setPassword}
                    submit={handleSubmit}
                    maxLength={30}
					password={true}
				/>
                <IconInput
                    id="signup-confirm"
                    style={iconInputStyle}
                    icon="lock"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    setValue={setConfirmPassword}
                    submit={handleSubmit}
                    maxLength={30}
					password={true}
                />
            </div>
            {error && <p>error: {error}</p>}
            <NavigationButton
                mainTitle="Signup"
                secondTitle="signin"
                onClick={() => handleSubmit()}
                path="/login/signin"
            />
        </div>
    )
}
