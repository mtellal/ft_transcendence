import { BackApi } from "../../api/back";
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import s from './style.module.css'

export function Profile() {

    async function updateProfile(e) {
        e.preventDefault();
        const user = e.target.username.value;
        const passwd = e.target.password.value;

        let updateinfos = {userStatus: "ONLINE"};
        if (user) {
            updateinfos.username = user;
        } if (passwd) {
            updateinfos.password = passwd;
        }

        console.log(updateinfos);

        const response = await BackApi.updateInfoProfile(2, updateinfos)
        if (response.status === 200) {
            console.log('profile updated');
        } else {
            console.log('profile NOT updated');
            console.log(response.data.message);
        }
    }

    return (
        <div className={s.profile}>
            <div className={s.title}>Update profile</div>
            <form onSubmit={updateProfile} className={s.form}>
                <img className={s.logoUser} src={logo_user} alt="logo user"></img>
                <input className={s.element} placeholder='Username' name="username" ></input>
                <img className={s.logoPasswd} src={logo_password} alt="logo password"></img>
                <input className={s.element} placeholder='Password' name="password" ></input>
                <button type='submit' className={s.element}>Update</button>
            </form>
        </div>
    );
}