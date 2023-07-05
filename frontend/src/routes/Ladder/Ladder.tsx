import React, { useCallback, useEffect, useState } from "react";
import { getLadder } from "../../requests/user";
import { useCurrentUser } from "../../hooks/Hooks";

import './Ladder.css'
import ProfilePicture from "../../components/users/ProfilePicture";
import useFetchUsers from "../../hooks/useFetchUsers";


function BestPlayer({ user, stats, index }: any) {

	const { fetchUserProfilePicture } = useFetchUsers();
	const [url, setUrl] = useState(null);

	async function loadProfilePicture(id: number) {
		setUrl(await fetchUserProfilePicture(id));
	}

	useEffect(() => {
		if (user && user.id)
			loadProfilePicture(user.id)
	}, [user])

	function style() {
		if (index === 2)
			return { marginTop: '30px' }
		if (index === 3)
			return { marginTop: '60px' }
		return ({})
	}

	return (
		<div
			className="bestplayers-user-label relative"
			style={style()}
		>
			<div className="bestplayers-rank absolute">
				<p className="bestplayers-rank-hashtag">#</p>
				<p
					className="bestplayers-rank-index"
					style={index === 1 ? { fontSize: '40px' } : index === 2 ? { fontSize: '35px' } : {}}

				>{index}</p>
			</div>
			<div style={{ height: '90px', width: '90px' }}>
				<ProfilePicture
					image={url}
				/>
			</div>
			<p className="bestplayers-user-username">{user.username}</p>
			<p className="bestplayers-user-elo">{stats.eloRating}</p>
			<div className="bestplayers-user-stats">
				<p>Matches played: {stats.matchesPlayed} </p>
				<p>Matches won: {stats.matchesWon}</p>
				<p>Matches lost: {stats.matchesLost}</p>
				<p>Win streak: {stats.winStreak}</p>
			</div>
		</div>
	)
}


function Bestplayers({ ladder }: any) {
	return (
		<div className="bestplayers" style={{}}>
			<p className="bestplayers-title">Best players</p>
			{
				ladder && ladder.length ?
					<div className="bestplayers-users">
						{ladder[2] && <BestPlayer user={ladder[2]} index={3} stats={ladder[2] && ladder[2].stats} />}
						{ladder[0] && <BestPlayer user={ladder[0]} index={1} stats={ladder[0] && ladder[0].stats} />}
						{ladder[1] && <BestPlayer user={ladder[1]} index={2} stats={ladder[1] && ladder[1].stats} />}
					</div>
					:
					<p>No users found</p>
			}
		</div>
	)

}


function LadderUser({ user, stats, index }: any) {
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
		<div className="flex-ai relative label reset" style={{ padding: '5px 20px', width: '60%' }}>
			<div className="ladderuser-rank absolute">
				<p className="ladderuser-rank-hashtag">#</p>
				<p
					className="ladderuser-rank-index"
					style={index === 1 ? { fontSize: '40px' } : index === 2 ? { fontSize: '35px' } : {}}

				>{index}</p>
			</div>
			<div className="pointer" style={{ height: '40px', width: '40px' }}>
				<ProfilePicture
					image={url}
				/>
			</div>
			<p className="ladderuser-username pointer" style={{ padding: '0 10px' }}>{user.username}</p>
			<p className="ladderuser-elo" style={{ marginLeft: 'auto', padding: '0 10px' }}>{stats.eloRating}</p>

		</div>
	)

}

function LadderUsers({ ladder }: any) {
	return (
		<>
			{
				ladder && ladder.length > 3 &&
				<div
					className="ladder-users flex-column-center"
				>
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

	const { user, token } = useCurrentUser();
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
		<div className="ladder-container flex-column" style={{ alignItems: 'center' }}>

			<div className=" flex-column-center"
				style={{ minWidth: '450px', maxWidth: '900px', width: '70%' }}>
				<Bestplayers ladder={ladder} />

				<LadderUsers ladder={ladder} />
			</div>

		</div>
	);
}