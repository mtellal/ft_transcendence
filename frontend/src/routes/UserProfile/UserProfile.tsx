import React, { useEffect, useState } from "react";
import { getUser, getUserProfilePictrue } from "../../requests/user";
import { HistoryMatchs } from "../../components/HistoryMatchs/HistoryMatchs";
import { Achievements } from "../../components/Achievements/Achievements";
import { Stats } from "../../components/Stats/Stats";
import s from './style.module.css'

interface UserProfileProps {
	id: number;
}

export function UserProfile({ id }: UserProfileProps) {

	const [data, setData] = useState<any>();
	const [avatar, setAvatar] = useState<any>();

	async function getInfoUser() {
		const dataUser = await getUser(id);
		setData(dataUser.data);
		const pp = await getUserProfilePictrue(id);
		setAvatar(window.URL.createObjectURL(new Blob([pp.data])));
	}

	useEffect(() => {
			getInfoUser();
	}, [])

	if (!data || !avatar) {
		return ;
	}

	return (
		<div className={s.container}>
			<div className={s.infoUser}>
				<p className={s.username}>{data.username}</p>
				<img className={s.image} src={avatar} alt="profilePictureUser"></img>
			</div>
			<div className={s.stats}>
				<HistoryMatchs id={id} />
				<Stats id={id} />
			</div>
			<Achievements id={id} />
		</div>
	);
}