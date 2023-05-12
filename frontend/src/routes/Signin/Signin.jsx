import s from "./style.module.css"
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import { useNavigate } from "react-router-dom";
import { BackApi } from "../../api/back";
import { createCookie } from "../../utils/cookie";

export function Signin() {

	const navigate = useNavigate();

	async function submitData(e) {
		e.preventDefault();
		const username = e.target.username.value;
		const password = e.target.password.value;
		// console.log(username, password);
		const response = await BackApi.authSigninpUser(username, password);
		if (response.status === 200) {
			console.log('user connecte');
			// console.log(response.data);
			createCookie("access_token", response.data.access_token);
		}
		else {
			console.log('user  PAS connecte')
		}
		// const e.target.confirm_password.value;
	}

    return (
        <div className={s.signin}>
            <div className={s.title}>Signin</div>
            <form className={s.form} onSubmit={submitData}>
                <div className={s.form_group}>
                    {/* <label>Username</label> */}
                    <img className={s.logo} src={logo_user} alt="logo user"></img>
                    <input type="text" name="username" placeholder="Username" className={s.input_field}></input>
                </div>
                <div className={s.form_group}>
                    {/* <label>Password</label> */}
                    <img className={s.logo} src={logo_password} alt="logo password"></img>
                    <input type="text" name="password" placeholder="Password" className={s.input_field}></input>
                </div>
                <button className={s.submitButton} type="submit">Submit</button>
            </form>
			<button className={s.btnSignup} onClick={() => navigate('/signup')}>Signup</button>
        </div>
    );
}