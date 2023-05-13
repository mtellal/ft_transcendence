import s from "./style.module.css"
import logo_user from "../../assets/logo_identifiant.png"
import logo_password from "../../assets/logo_mdp.png"
import avatar_default from "../../assets/alpaga.jpg"
import { useNavigate } from "react-router-dom";
import { BackApi } from "../../api/back";
import { createCookie } from "../../utils/cookie";
import { saveInfoUser, setAvatar, setToken } from "../../store/user/user-slice";
import { useDispatch } from "react-redux";

export function Signin() {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    }

	async function submitData(e) {
		e.preventDefault();
		const username = e.target.username.value;
		const password = e.target.password.value;
		const response = await BackApi.authSigninpUser(username, password);
		if (response.status === 200) {
			console.log('user connected');
			createCookie("access_token", response.data.access_token);
            const id = parseJwt(response.data.access_token).sub;
            dispatch(setToken(response.data.access_token));
            const rep = (await BackApi.getUserInfoById(id)).data;
            // console.log('TEST', rep);
            // if (!rep.avatar) {
                // BackApi.updateAvatar(id, avatar_default);
                // dispatch(setAvatar(avatar_default));
            // }
            dispatch(saveInfoUser(rep));
            navigate('/profile');
		}
		else {
			console.log('user NOT connected')
		}
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
                    <input type="password" name="password" placeholder="Password" className={s.input_field}></input>
                </div>
                <button className={s.submitButton} type="submit">Submit</button>
            </form>
			<button className={s.btnSignup} onClick={() => navigate('/signup')}>Signup</button>
        </div>
    );
}