import React, { useCallback, useEffect, useState } from "react";
import { useCurrentUser } from "../../hooks/Hooks";
import ProfilePicture from "../../components/users/ProfilePicture";
import { Game, User } from "../../types";
import ligntning from '../../assets/lightning.svg'
import { getMatchHistory } from "../../requests/user";
import useFetchUsers from "../../hooks/useFetchUsers";

import './Profile.css'

import './History.css'
import { useNavigate } from "react-router-dom";

function HistoryLabel({ game, player2, player1 }: any) {

    const navigate = useNavigate();

    return (
        <div
            className="profile-history-label flex-ai"
            style={player1 && player1.id !== game.wonBy ? { backgroundColor: '#FFDBDB' } : {}}
        >
            <div
                className="profile-history-label-side flex-ai"
            >
                <p className="profile-history-label-username">{player1 && player1.username}</p>
                <div style={{ height: '50px', width: '50px' }}>
                    <ProfilePicture
                        image={player1 && player1.url}
                    />
                </div>
                <p className="profile-history-label-score"
                >
                    {player1 && game.player1Id === player1.id ? game.player1Score : game.player2Score}
                </p>
            </div>

            <div>
                <img
                    src={ligntning}
                    style={{ flex: 1, height: '50px' }}
                />
                <p className="reset" style={{ fontSize: '10px' }}>{game.gametype}</p>
            </div>

            <div
                className="profile-history-label-side flex-ai"
                style={{ flexDirection: 'row-reverse' }}
            >
                <p className="profile-history-label-username">
                    {player2 && player2.username}
                </p>
                <div
                    className="pointer" style={{ height: '50px', width: '50px' }}
                    onClick={() => navigate(`/user/${player2.id}`)}
                >
                    <ProfilePicture
                        image={player2 && player2.url}
                        boxShadow={true}
                    />
                </div>
                <p
                    className="profile-history-label-score"
                >
                    {player2 && game.player2Id === player2.id ? game.player2Score : game.player1Score}
                </p>
            </div>

        </div>
    )
}

type THistory = {
    user: User
}

export default function History({ user }: THistory) {

    const { token } = useCurrentUser();
    const { fetchUsers } = useFetchUsers();

    const [history, setHistory] = useState([]);
    const [players, setPlayers] = useState([]);

    const loadPlayers = useCallback(async (games: Game[]) => {
        const ids: number[] = [];
        games.map((e: Game) => {
            if (e.player2Id !== user.id && !ids.find((id: number) => e.player2Id === id))
                ids.push(e.player2Id)
            if (e.player1Id !== user.id && !ids.find((id: number) => e.player1Id === id))
                ids.push(e.player1Id)
        });
        setPlayers(await fetchUsers(ids));
    }, [user])

    const loadHistory = useCallback(async () => {
        let games: Game[];
        await getMatchHistory(user.id, token)
            .then(res => {
                if (res.data) {
                    games = res.data;
                    setHistory(res.data);
                }
            })
        loadPlayers(games);
    }, [user, token]);

    useEffect(() => {
        if (user && token)
            loadHistory();
    }, [user, token])

    return (
        <div
            className="profile-history"
        >
            <p className="profile-font-title1" style={{ margin: '0' }}>History</p>
            <div className="flex-column-center" style={{ marginTop: '15px' }}>
                {
                    history && history.length ?
                        <div className="fill flex-column" style={{ gap: '10px' }}>
                            {
                                history.map((e: Game) =>
                                    <HistoryLabel
                                        key={e.id}
                                        game={e}
                                        player1={user}
                                        player2={players && players.find((p: User) => p.id === e.player1Id || p.id === e.player2Id)}
                                    />
                                )
                            }
                        </div>
                        :
                        <div>
                            <p className="profile-font-button1">No history</p>
                        </div>
                }
            </div>

        </div>
    )
}
