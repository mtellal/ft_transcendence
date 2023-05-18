import { Header } from "./components/Header/Header";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCookieByName, parseJwt } from "./utils/auth";
import { saveInfoUser, setAvatar, setToken } from "./store/user/user-slice";
import { useDispatch, useSelector } from "react-redux";
import { BackApi } from "./api/back";
import "./global.css"

export function App() {

    const dispatch = useDispatch();
    const selector = useSelector(store => store.USER.user);
    const navigate = useNavigate();

    async function saveInfosUser(token) {
        const id = parseJwt(token).sub;
        dispatch(setToken(token));
        const rep = (await BackApi.getUserInfoById(id)).data;
        dispatch(saveInfoUser(rep));
		const resp = await BackApi.getProfilePictureById(id);
		dispatch(setAvatar(URL.createObjectURL(new Blob([resp.data]))));
    }

	useEffect(() => {
        const token = getCookieByName('access_token');
        if (!token) {
            navigate('/signin');
            console.log('Pas de cookie (token)');
        }
        if (!selector.id && token) {
            saveInfosUser(token);
        }
		// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector.id])

	return (
		<div>
			<Header />
			<div>
				<Outlet />
			</div>
		</div>
	);
}