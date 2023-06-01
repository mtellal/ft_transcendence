import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BackApi } from "../../api/back";
import logo_user from "../../assets/logo_identifiant.png";
import logo_password from "../../assets/logo_mdp.png";
import { setAvatar } from "../../store/user/user-slice";
import s from './style.module.css';
export function Profile() {
    const selector = useSelector((store) => store.user.user);
    const dispatch = useDispatch();
    async function updateProfile(e) {
        e.preventDefault();
        const user = e.currentTarget.username.value;
        const passwd = e.currentTarget.password.value;
        let updateinfos = { userStatus: "ONLINE", username: "", password: "" };
        if (user) {
            updateinfos.username = user;
        }
        if (passwd) {
            updateinfos.password = passwd;
        }
        await BackApi.updateInfoProfile(selector.id, updateinfos);
    }
    // Tester sans la declaration de type (pas d'err ni de warn)
    async function setProfilePicture(e) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            dispatch(setAvatar(reader.result));
        };
        await BackApi.updateProfilePicture(e.target.files[0], selector.token);
    }
    return (React.createElement("div", { className: s.profile },
        React.createElement("div", { className: s.title }, "Update profile"),
        React.createElement("label", { htmlFor: "file", className: s.label_file }, "Choose a picture"),
        React.createElement("input", { id: "file", className: s.input_file, type: "file", accept: "image/*", name: "image", onChange: setProfilePicture }),
        selector.avatar && React.createElement("img", { className: s.img, src: selector.avatar, alt: "profile_picture" }),
        React.createElement("form", { onSubmit: updateProfile, className: s.form },
            React.createElement("img", { className: s.logoUser, src: logo_user, alt: "logo user" }),
            React.createElement("input", { type: "text", className: s.element, placeholder: 'Username', name: "username" }),
            React.createElement("img", { className: s.logoPasswd, src: logo_password, alt: "logo password" }),
            React.createElement("input", { type: "password", className: s.element, placeholder: 'Password', name: "password", id: "input" }),
            React.createElement("button", { type: 'submit', className: s.element }, "Update"))));
}
