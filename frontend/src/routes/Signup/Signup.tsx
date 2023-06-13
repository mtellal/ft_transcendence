import React, { FormEvent, useState } from 'react';
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import avatar_default from "../../assets/alpaga.jpg"
import { BackApi } from "../../api/back";
import { createCookie, parseJwt } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAvatar } from "../../store/user/user-slice";
import s from "./style.module.css"

export function Signup() {

	const navigate = useNavigate();
    const dispatch = useDispatch();
	const [errPassword, setErrPassword] = useState(false);

    async function setDefualtProfilePicture(token: string, id: number) {
        const img = await fetch(avatar_default);
        const blob = await img.blob();
        await BackApi.updateProfilePicture(blob, token);
        let rep = await BackApi.getProfilePictureById(id);
        dispatch(setAvatar(URL.createObjectURL(new Blob([rep.data]))));
    }

	async function submitData(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const username = e.currentTarget.username.value;
		const password = e.currentTarget.password.value;
		const confPassword = e.currentTarget.confirm_password.value;

		if (password !== confPassword || password === '') {
			setErrPassword(true);
		} else {
			const response = await BackApi.authSignupUser(username, password);
			const id = parseJwt(response.data.access_token).id;
			if (response.status === 201) {
				createCookie("access_token", response.data.access_token);
				setDefualtProfilePicture(response.data.access_token, id);
				navigate('/signin');
			}
        }
	}

    // async function test(e: any) {
    //     e.preventDefault();
    //     // console.log('OKKK');
    //     const response = await BackApi.auth42();
    //     console.log('response', response);
    // }

    return (
        <div className={s.signup}>
            <div className={s.title}>Signup</div>
            <form className={s.form} onSubmit={submitData}>
                <div className={s.form_group}>
                    <img className={s.logo} src={logo_user} alt="logo user"></img>
                    <input type="text" name="username" placeholder="Username" className={s.input_field}></input>
                </div>
                <div className={s.form_group}>
                    <img className={s.logo} src={logo_password} alt="logo password"></img>
                    <input type="password" name="password" placeholder="Password" className={s.input_field}></input>
                </div>
				<div className={s.form_group}>
                    <img className={s.logo} src={logo_password} alt="logo password"></img>
                    <input type="password" name="confirm_password" placeholder="Confirm Password" className={s.input_field}></input>
                </div>
				<div className={s.errPassword}>
					{errPassword && 'Err : Saisir 2 mot de passe identiques'}
				</div>
                <button className={s.signinButton} type="submit">Submit</button>
            </form>
			<button className={s.btnSignin} onClick={() => navigate('/signin')}>Signin</button>
            <form action='http://localhost:3000/auth/42'>
                <button type='submit'>TEST AUTH 42</button>
            </form>
       </div>
    );
}