import React, { useEffect, useState } from "react";
import logo_user from "../../assets/user.png"
import { getMatchHistory, getUser, getUserProfilePictrue } from "../../requests/user";
import { HistoryMatchs } from "../../components/HistoryMatchs/HistoryMatchs";
import s from './style.module.css'

interface UserProfileProps {
	id: number;
}

export function UserProfile({ id }: UserProfileProps) {

	const [data, setData] = useState<any>();

	async function getInfoUser() {
		const dataUser = await getUser(id);
		setData(dataUser.data);
		// Ici, recuperer la photo de profile


	}

	useEffect(() => {
		getInfoUser();
	}, [])

	if (!data) {
		return ;
	}

	return (
		<div className={s.container}>
			<div className={s.infoUser}>
				<p className={s.username}>{data.username}</p>
				<img className={s.image} src={logo_user} alt="profilePictureUser"></img>
			</div>
			<HistoryMatchs id={id} />
		</div>
	);
}