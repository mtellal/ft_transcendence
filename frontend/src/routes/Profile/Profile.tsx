import React, { VoidFunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useCurrentUser } from "../../hooks/Hooks";

import ProfilePicture from "../../components/users/ProfilePicture";

import './Profile.css'
import { Game, User } from "../../types";

import ligntning from '../../assets/lightning.svg'
import { getMatchHistory } from "../../requests/user";
import useFetchUsers from "../../hooks/useFetchUsers";


function ProfileC1() {

    const navigate = useNavigate();
    const { user } = useCurrentUser();
    const [settings, setSettings] = useState(false);

    return (
        <div
            className="flex-column"
            style={{ flex: '1', marginRight: '5%' }}
        >

            <div style={{ height: '150px', width: '150px' }}>
                <ProfilePicture
                    image={user && user.url}
                />
            </div>
            <div
                className="flex-column reset"
            >
                <p
                    className="profile-c1-font-username reset"
                    style={{ marginTop: '15px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {user && user.username}
                </p>
                <p
                    className="reset profile-c1-font-menu pointer"
                    style={settings ? { marginTop: '20px' } : { marginTop: '20px', color: 'black' }}
                    onClick={() => { setSettings(false); navigate("/profile") }}
                >
                    Profile
                </p>
                <p
                    className="reset profile-c1-font-menu pointer"
                    style={settings ? { marginTop: '8px', color: 'black' } : { marginTop: '8px' }}
                    onClick={() => { setSettings(true);; navigate("/profile/settings") }}
                >
                    Settings
                </p>
                <button
                    className="profile-c1-button"
                    style={{ marginTop: '22px' }}
                    onClick={() => navigate("/login")}
                >
                    Logout
                </button>
            </div>

            {
                !settings &&
                <div
                    className="profile-statistics flex-column red"
                >
                    <p className="profile-statistics-title reset">Statistics</p>
                    <div className="profile-statistics-elements">
                        <p>Elo: 1016</p>
                        <p>Matches played: 1</p>
                        <p>Matches won: 1</p>
                        <p>Matched lost: 0</p>
                        <p>Goals scored: 10</p>
                        <p>Goals taken: 2</p>
                        <p>Win streak: 2</p>
                        <p>Loss streak: 0</p>
                    </div>
                </div>
            }


        </div>
    )
}

export default function Profile() {

    return (
        <div className="profile flex scroll">

            <ProfileC1 />

            <Outlet />
        </div>
    )
}

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
            style={user && user.id !== game.wonBy ? {backgroundColor: '#FFDBDB'} : {}}
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
                <p className="reset" style={{fontSize: '10px'}}>{game.gametype}</p>
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

export function History() {

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
            className="flex"
            style={{ flex: '5', gap: '30px', minWidth: '700px' }}
        >

            <div
                className="profile-history"
                style={{}}
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
                            : null
                    }

                    {/*                     <HistoryLabel
                        user1={user}
                        user2={user}
                        score1={10}
                        score2={8}
                    /> */}
                </div>

            </div>


            <div className="red" style={{ flex: 1 }}>

            </div>

        </div>
    )
}
