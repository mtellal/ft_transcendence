import React from "react";
import { BackApi } from "../../api/back";
import { createCookie, parseJwt } from "../../utils/auth";
import { useDispatch } from "react-redux";
import { saveInfoUser, setAvatar, setToken } from "../../store/user/user-slice";
import { useNavigate } from "react-router-dom";

export function Login() {

	const dispatch = useDispatch();
	const navigate = useNavigate();

	async function login() {
		let url: string = document.location.href;
		const oauth_code: string[] = url.split('=');
		const rep = await BackApi.authTrade(oauth_code[1]);
		createCookie("access_token", rep.data.access_token);
		const id = parseJwt(rep.data.access_token).id;
		dispatch(setToken(rep.data.access_token));
		const repo = (await BackApi.getUserInfoById(id)).data;
		dispatch(saveInfoUser(repo));
			let resp = await BackApi.getProfilePictureById(id);
			if (resp.status === 200) {
				dispatch(setAvatar(URL.createObjectURL(new Blob([resp.data]))));
			}
		navigate('/chat');
	}

	login();

	return (
		<div>
			TEST LOGIN
		</div>
	);
}