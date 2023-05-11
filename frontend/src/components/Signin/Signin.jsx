import s from "./style.module.css"
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import { useNavigate } from "react-router-dom";

export function Signin() {

	const navigate = useNavigate();

    return (
        <div className={s.signin}>
            <div className={s.title}>Signin</div>
            <form className={s.form}>
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
                <button>Submit</button>
            </form>
			<button className={s.btnSignup} onClick={() => navigate('/signup')}>Signup</button>
        </div>
    );
}