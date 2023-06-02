import React from "react";
import s from "./style.module.css";
import logo_user from "../../assets/logo_identifiant.png";
import logo_password from "../../assets/logo_mdp.png";
import { useNavigate } from "react-router-dom";
import { BackApi } from "../../api/back";
import { createCookie, parseJwt } from "../../utils/auth";
import { saveInfoUser, setAvatar, setToken } from "../../store/user/user-slice";
import { useDispatch } from "react-redux";
export function Signin() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function submitData(e) {
        e.preventDefault();
        const username = e.currentTarget.username.value;
        const password = e.currentTarget.password.value;
        const response = await BackApi.authSigninpUser(username, password);
        if (response.status === 200) {
            createCookie("access_token", response.data.access_token);
            const id = parseJwt(response.data.access_token).id;
            dispatch(setToken(response.data.access_token));
            const rep = (await BackApi.getUserInfoById(id)).data;
            dispatch(saveInfoUser(rep));
            let resp = await BackApi.getProfilePictureById(id);
            if (resp.status === 200) {
                dispatch(setAvatar(URL.createObjectURL(new Blob([resp.data]))));
            }
            navigate('/chat');
        }
    }
    return (React.createElement("div", { className: s.signin },
        React.createElement("div", { className: s.title }, "Signin"),
        React.createElement("form", { className: s.form, onSubmit: submitData },
            React.createElement("div", { className: s.form_group },
                React.createElement("img", { className: s.logo, src: logo_user, alt: "logo user" }),
                React.createElement("input", { type: "text", name: "username", placeholder: "Username", className: s.input_field })),
            React.createElement("div", { className: s.form_group },
                React.createElement("img", { className: s.logo, src: logo_password, alt: "logo password" }),
                React.createElement("input", { type: "password", name: "password", placeholder: "Password", className: s.input_field })),
            React.createElement("button", { className: s.submitButton, type: "submit" }, "Submit")),
        React.createElement("button", { className: s.btnSignup, onClick: () => navigate('/signup') }, "Signup")));
}
