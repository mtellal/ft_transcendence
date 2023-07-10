import React, { useEffect, useState } from "react";

import ProfilePicture from "../../components/users/ProfilePicture";
import useFetchUsers from "../../hooks/useFetchUsers";
import { useNavigate } from "react-router-dom";
import './Bestplayers.css'

function BestPlayer({ user, stats, index }: any) {

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
			className="bestplayers-user-label relative pointer"
			style={index === 2 ? { marginTop: '30px' } : index === 3 ? { marginTop: '60px' } : {}}
			onClick={() => navigate(`/user/${user.id}`)}
		>
			<div className="bestplayers-rank absolute">
				<p className="bestplayers-rank-hashtag">#</p>
				<p
					className="bestplayers-rank-index"
					style={index === 1 ? { fontSize: '40px' } : index === 2 ? { fontSize: '35px' } : {}}
				>{index}</p>
			</div>
			<div style={{ height: '90px', width: '90px' }}>
				<ProfilePicture image={url} boxShadow={true} />
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


export default function Bestplayers({ ladder }: any) {
	return (
		<div className="bestplayers" style={{}}>
			<p className="bestplayers-title reset">Best players</p>
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
