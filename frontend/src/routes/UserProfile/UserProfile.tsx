import React, { useCallback, useEffect, useState } from "react";
import { getUser, getUserProfilePictrue } from "../../requests/user";
import { HistoryMatchs } from "../../components/HistoryMatchs/HistoryMatchs";
import { Achievements } from "../../components/Achievements/Achievements";
import { Stats } from "../../components/Stats/Stats";
import s from './style.module.css'
import { useCurrentUser } from "../../hooks/Hooks";
import { useParams } from "react-router-dom";
import ProfilePicture from "../../components/users/ProfilePicture";
import ResizeContainer from "../../components/ResizeContainer";


export function UserProfile() {

	const params = useParams();
	const { token } = useCurrentUser();
	const [data, setData] = useState<any>();
	const [avatar, setAvatar] = useState<any>();
	const [userId, setUserId]: any = useState();

	useEffect(() => {
		if (params && params.userId) {
			setUserId(params.userId);
		}
	}, [params])

	const getInfoUser = useCallback(async () => {
		const dataUser = await getUser(userId, token);
		if (dataUser && dataUser.data)
			setData(dataUser.data);
		const pp = await getUserProfilePictrue(userId, token);
		if (pp)
			setAvatar(window.URL.createObjectURL(new Blob([pp.data])));
	}, [userId, token]);

	useEffect(() => {
		if (userId)
			getInfoUser();
	}, [userId, getInfoUser])

	return (
		< div className={s.container}>
			{
				data && avatar ?
					<>
						<div className={s.infoUser}>
							<p className={s.username}>{data.username}</p>
							<ResizeContainer height="100px">
								<ProfilePicture image={avatar} />
							</ResizeContainer>
						</div>
						<div className={s.stats}>
							<HistoryMatchs id={userId} />
							<Stats id={userId} />
						</div>
						<Achievements id={userId} />
					</>
					:
					<div className="flex-center fill">
						<p>
							No user found
						</p>
					</div>
			}
		</div >
	);
}