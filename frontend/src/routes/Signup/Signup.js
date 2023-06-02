import React from 'react';
import logo_user from "../../assets/logo_identifiant.png";
import logo_password from "../../assets/logo_mdp.png";
import avatar_default from "../../assets/alpaga.jpg";
import { BackApi } from "../../api/back";
import { createCookie, parseJwt } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAvatar } from "../../store/user/user-slice";
import s from "./style.module.css";
export function Signup() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    async function setDefualtProfilePicture(token, id) {
        const img = await fetch(avatar_default);
        const blob = await img.blob();
        // console.log('img', img);
        // console.log('blob', blob);
        // await BackApi.updateProfilePicture(img, token, 'file');
        await BackApi.updateProfilePicture(blob, token);
        let rep = await BackApi.getProfilePictureById(id);
        dispatch(setAvatar(URL.createObjectURL(new Blob([rep.data]))));
    }
    async function submitData(e) {
        e.preventDefault();
        const username = e.currentTarget.username.value;
        const password = e.currentTarget.password.value;
        const response = await BackApi.authSignupUser(username, password);
        const id = parseJwt(response.data.access_token).id;
        if (response.status === 201) {
            createCookie("access_token", response.data.access_token);
            setDefualtProfilePicture(response.data.access_token, id);
            navigate('/signin');
        }
    }
    return (React.createElement("div", { className: s.signup },
        React.createElement("div", { className: s.title }, "Signup"),
        React.createElement("form", { className: s.form, onSubmit: submitData },
            React.createElement("div", { className: s.form_group },
                React.createElement("img", { className: s.logo, src: logo_user, alt: "logo user" }),
                React.createElement("input", { type: "text", name: "username", placeholder: "Username", className: s.input_field })),
            React.createElement("div", { className: s.form_group },
                React.createElement("img", { className: s.logo, src: logo_password, alt: "logo password" }),
                React.createElement("input", { type: "password", name: "password", placeholder: "Password", className: s.input_field })),
            React.createElement("div", { className: s.form_group },
                React.createElement("img", { className: s.logo, src: logo_password, alt: "logo password" }),
                React.createElement("input", { type: "password", name: "confirm_password", placeholder: "Confirm Password", className: s.input_field })),
            React.createElement("button", { className: s.signinButton, type: "submit" }, "Submit")),
        React.createElement("button", { className: s.btnSignin, onClick: () => navigate('/signin') }, "Signin")));
}
