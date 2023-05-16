import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import avatar_default from "../../assets/alpaga.jpg"
import { BackApi } from "../../api/back";
import { createCookie, parseJwt } from "../../utils/auth";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import s from "./style.module.css"
import { setAvatar } from "../../store/user/user-slice";

export function Signup() {

	const navigate = useNavigate();
    const dispatch = useDispatch();

    async function setDefualtProfilePicture(token, id) {
        const img = await fetch(avatar_default);
        const blob = await img.blob();

        const response = await BackApi.updateProfilePicture(blob, token);
        if (response.status === 201) {
            console.log("File uploaded successfully!");
        } else {
            console.log("Error uploading file");
        }
        console.log('ID ', id)
        let rep = await BackApi.getProfilePictureById(id);
        dispatch(setAvatar(URL.createObjectURL(new Blob([rep.data]))));
    }

	async function submitData(e) {
		e.preventDefault();
		const username = e.target.username.value;
		const password = e.target.password.value;
		// console.log(username, password);
		const response = await BackApi.authSignupUser(username, password);
        const id = parseJwt(response.data.access_token).sub;
        // console.log('Auth signup', response.data);
		if (response.status === 201) {
			console.log('user cree');
			// console.log(response.data);
			createCookie("access_token", response.data.access_token);
            setDefualtProfilePicture(response.data.access_token, id);
            navigate('/signin');
        }
		else {
			console.log('user  PAS cree')
		}
		// const e.target.confirm_password.value;
	}

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
                <button className={s.signinButton} type="submit">Submit</button>
            </form>
			<button className={s.btnSignin} onClick={() => navigate('/signin')}>Signin</button>
        </div>
    );
}