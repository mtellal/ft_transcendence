import React, { VoidFunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useCurrentUser } from "../../hooks/Hooks";

import ProfilePicture from "../../components/users/ProfilePicture";

import './Profile.css'
import { Game, User } from "../../types";

import ligntning from '../../assets/lightning.svg'
import { getMatchHistory } from "../../requests/user";
import useFetchUsers from "../../hooks/useFetchUsers";

function HistoryLabel({ game }: any) {

    const { user } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
    const [player2, setPlayer2] = useState(null);


    const loadPLayer2 = useCallback(async () => {
        let p2: any = game.player2Id === user.id ? game.player1Id : game.player2Id;
        p2 = await fetchUser(p2);
        setPlayer2(p2);
    }, [game])

    useEffect(() => {
        if (game) {
            loadPLayer2();
        }
    }, [game])

    return (
        <div
            className="profile-history-label flex-ai"
            style={user && user.id !== game.wonBy ? { backgroundColor: '#FFDBDB' } : {}}
        >
            <div
                className="profile-history-label-side flex-ai"
            >
                <p className="profile-history-label-username">{user && user.username}</p>
                <div style={{ height: '50px', width: '50px' }}>
                    <ProfilePicture
                        image={user && user.url}
                    />
                </div>
                <p className="profile-history-label-score"
                >
                    {user && game.player1Id === user.id ? game.player1Score : game.player2Score}
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
                <p className="profile-history-label-username">{player2 && player2.username}</p>
                <div style={{ height: '50px', width: '50px' }}>
                    <ProfilePicture
                        image={player2 && player2.url}
                    />
                </div>
                <p className="profile-history-label-score"
                >
                    {player2 && game.player2Id === player2.id ? game.player2Score : game.player1Score}
                </p>
            </div>

        </div>
    )
}

export default function History() {

    const { user, token } = useCurrentUser();

    const [history, setHistory] = useState([]);


    const loadHistory = useCallback(async () => {
        await getMatchHistory(user.id, token)
            .then(res => {
                if (res.data) {
                    setHistory(res.data);
                }
            })
    }, [user, token]);

    useEffect(() => {
        if (user && token)
            loadHistory();
    }, [user, token])

    return (
        <div
            className="profile-history"
            style={{minWidth: '400px'}}
        >
            <p className="profile-history-title">History</p>

            <div className="flex-column-center" style={{ marginTop: '15px' }}>

                {
                    history && history.length ?
                        <div className="fill flex-column" style={{ gap: '10px' }}>
                            {
                                history.map((e: Game) =>
                                    <HistoryLabel
                                        key={e.id}
                                        game={e}
                                    />
                                )
                            }
                        </div>
                        :
                        null
                }
            </div>

        </div>
    )
}
