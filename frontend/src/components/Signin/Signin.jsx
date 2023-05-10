import s from "./style.module.css"
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"

export function Signin() {
    return (
        <div className={s.signin}>
            <div className={s.title}>Signin</div>
            <form className={s.form}>
                <div className={s.form_group}>
                    {/* <label>Username</label> */}
                    <img className={s.logo} src={logo_user}></img>
                    <input type="text" name="username" placeholder="Username" className={s.input_field}></input>
                </div>
                <div className={s.form_group}>
                    {/* <label>Password</label> */}
                    <img className={s.logo} src={logo_password}></img>
                    <input type="text" name="password" placeholder="Password" className={s.input_field}></input>
                </div>
                <button>Submit</button>
            </form>
        </div>
    );
}