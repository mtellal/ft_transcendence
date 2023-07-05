import React, { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate, useNavigation, useOutletContext, useParams } from "react-router-dom";

import { useCurrentUser } from "../../hooks/Hooks";

import ProfilePicture from "../../components/users/ProfilePicture";

import History from "./History";
import { Achievements } from "./Achievements";
import './Profile.css'
import { getStats } from "../../requests/user";
import useFetchUsers from "../../hooks/useFetchUsers";
import { User } from "../../types";

type TStatistics = {
    user: User
}

function Statistics({ user }: TStatistics) {

    const { token } = useCurrentUser();
    const [stats, setStats] = useState(null);

    const loadStats = useCallback(async () => {
        await getStats(user.id, token)
            .then(res => {
                if (res && res.data)
                    setStats(res.data);
            })
    }, [token, user])

    useEffect(() => {
        if (user && token)
            loadStats();
    }, [user, token])

    return (
        <div
            className="profile-statistics flex-column red"
        >
            <p className="profile-statistics-title reset">Statistics</p>
            <div className="profile-statistics-elements">
                <p>Elo: {stats && stats.eloRating}</p>
                <p>Matches played: {stats && stats.matchesPlayed}</p>
                <p>Matches won: {stats && stats.matchesWon}</p>
                <p>Matched lost: {stats && stats.matchesLost}</p>
                <p>Goals scored: {stats && stats.goalsScored}</p>
                <p>Goals taken: {stats && stats.goalsTaken}</p>
                <p>Win streak: {stats && stats.winStreak}</p>
                <p>Loss streak: {stats && stats.lossStreak}</p>
            </div>
        </div>
    )
}


function ProfileMenu({ _user }: any) {

    const navigate = useNavigate();
    const location = useLocation();
    const { userId } = useParams();

    const { user } = useCurrentUser();
    const [settings, setSettings] = useState(location && location.pathname === `/user/${user.id}/settings`);

    return (
        <div
            className="flex-column profile-menu"
        >

            <div>

                <div style={{ height: '150px', width: '150px' }}>
                    <ProfilePicture
                        image={_user && _user.url}
                    />
                </div>
                <div
                    className="flex-column reset"
                >
                    <p className="profile-menu-font-username reset">
                        {_user && _user.username}
                    </p>
                    {
                        user && Number(userId) === user.id &&
                        <>
                            <p
                                className="reset profile-menu-font-menu pointer"
                                style={settings ? { marginTop: '20px' } : { marginTop: '20px', color: 'black' }}
                                onClick={() => { setSettings(false); navigate(`/user/${user.id}`) }}
                            >
                                Profile
                            </p>
                            <p
                                className="reset profile-menu-font-menu pointer"
                                style={settings ? { marginTop: '8px', color: 'black' } : { marginTop: '8px' }}
                                onClick={() => { setSettings(true); navigate(`/user/${user.id}/settings`) }}
                            >
                                Settings
                            </p>
                            <button
                                className="profile-menu-button"
                                onClick={() => navigate("/login")}
                            >
                                Logout
                            </button>
                        </>
                    }
                </div>
            </div>

            {!settings && <Statistics user={_user} />}

        </div>
    )
}

export default function Profile() {

    const navigate = useNavigate();
    const { userId } = useParams();

    const { user } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
    const [_user, setUser] = useState(null);

    async function loadUser() {
        if (userId === user.id)
            setUser(user);
        else {
            const u = await fetchUser(Number(userId));
            if (!u)
                navigate(`/user/${user.id}`)
            else
                setUser(u);
        }
    }

    useEffect(() => {
        if (userId)
            loadUser();
    }, [userId, user])

    return (
        <div className="profile flex scroll">
            <ProfileMenu _user={_user} />
            <Outlet context={{ user: _user }} />
        </div>
    )
}

type outlenContext = { user: User }

export function PageInformations() {

    const { user } = useOutletContext<outlenContext>();

    return (
        <div
            className="flex profile-informations"
        >
            <History user={user} />
            <Achievements user={user} />
        </div>
    )
}

