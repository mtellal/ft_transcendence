import React, { useEffect, useState } from "react";
import logo_user from "../../assets/user.png"
import { getMatchHistory, getUser, getUserProfilePictrue } from "../../requests/user";
import { HistoryMatchs } from "../../components/HistoryMatchs/HistoryMatchs";
import { Achievements } from "../../components/Achievements/Achievements";
import { Stats } from "../../components/Stats/Stats";
import s from './style.module.css'

interface UserProfileProps {
	id: number;
}

export function UserProfile({ id }: UserProfileProps) {

	const [data, setData] = useState<any>();

	async function getInfoUser() {
		const dataUser = await getUser(id);
		setData(dataUser.data);
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
			<div className={s.stats}>
				<HistoryMatchs id={id} />
				<Stats id={id} />
			</div>
			<Achievements id={id} />
		</div>
	);
}