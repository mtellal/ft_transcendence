import React, { useCallback, useEffect, useState } from "react";
import { getLadder } from "../../requests/user";
import { useCurrentUser } from "../../hooks/Hooks";

import ProfilePicture from "../../components/users/ProfilePicture";
import useFetchUsers from "../../hooks/useFetchUsers";
import { useNavigate } from "react-router-dom";
import Bestplayers from "./Bestplayers";

import './Ladder.css'

function LadderUser({ user, stats, index }: any) {
	const navigate = useNavigate();
	const { fetchUserProfilePicture } = useFetchUsers();
	const [url, setUrl] = useState(null);

	async function loadProfilePicture(id: number) {
		setUrl(await fetchUserProfilePicture(id));
	}

	useEffect(() => {
		if (user && user.id)
			loadProfilePicture(user.id)
	}, [user])


	return (
		<div
			className="flex-ai relative label reset pointer"
			style={{ padding: '5px 20px', width: '60%' }}
			onClick={() => navigate(`/user/${user.id}`)}
		>
			<div className="ladderuser-rank absolute">
				<p className="ladderuser-rank-hashtag">#</p>
				<p
					className="ladderuser-rank-index"
					style={index === 1 ? { fontSize: '40px' } : index === 2 ? { fontSize: '35px' } : {}}

				>{index}</p>
			</div>
			<div style={{ height: '50px', width: '50px' }}>
				<ProfilePicture
					image={url}
				/>
			</div>
			<p className="ladderuser-username">{user.username}</p>
			<p className="ladderuser-elo">{stats.eloRating}</p>

		</div>
	)
}

function LadderUsers({ ladder }: any) {
	return (
		<>
			{
				ladder && ladder.length > 2 &&
				<div className="ladder-users flex-column-center" >
					{

						ladder.map((e: any, i: number) => i > 2 &&
							<LadderUser
								user={e}
								stats={e && e.stats}
								index={i + 1}
							/>
						)
					}
				</div>
			}
		</>
	)
}

export function Ladder() {

	const { token } = useCurrentUser();
	const [ladder, setLadder] = useState(null);

	const getData = useCallback(async () => {
		const rep = await getLadder(token);
		setLadder(rep.data);
	}, [token]);

	useEffect(() => {
		getData();
	}, [getData])

	if (!ladder) {
		return;
	}

	return (
		<div className="ladder flex-column" style={{ alignItems: 'center' }}>
			<div className="ladder-container flex-column-center">
				<Bestplayers ladder={ladder} />
				<LadderUsers ladder={ladder} />
			</div>
		</div>
	);
}