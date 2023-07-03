import React, { VoidFunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useCurrentUser } from "../../hooks/Hooks";

import ProfilePicture from "../../components/users/ProfilePicture";

import './Profile.css'
import { Achievements, Game, User } from "../../types";

import ligntning from '../../assets/lightning.svg'
import { getAchievements, getMatchHistory } from "../../requests/user";
import useFetchUsers from "../../hooks/useFetchUsers";
import History from "./History";


import novice from '../../assets/novice.png'
import intermediate from '../../assets/intermediate.png';
import expert from '../../assets/expert.png';
import master from '../../assets/master.png';
import onfire from '../../assets/fire.png';
import tenacious from '../../assets/tenacious.png';


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

function AchievementsLabel({ image, title, description, valid }: any) {
    return (
        <div
            className="profile-achievements-label flex-center"
            style={!valid ? {backgroundColor: '#CCC'} : {}}>
            <img
                className="profile-achievements-label-image"
                style={{ height: '50px', padding: '5px' }}
                src={image}
            />
            <div className="profile-achievements-label-infos flex-column"
                style={{ padding: '5px', width:'70%' }}
            >
                <p className="profile-c1-font-username">{title}</p>
                <p
                    className="profile-2fa-text2 "
                    style={{ marginTop: '5px'}}
                >
                    {description}
                </p>
            </div>
        </div>
    )
}

export function PageInformations() {

    const { user, token } = useCurrentUser();

    const [achievement, setAchievement] = useState(null);

    const loadAchievements = useCallback(async () => {
        await getAchievements(user.id, token)
            .then(res => {
                if (res && res.data && res.data.length)
                    setAchievement(res.data[0])
            })
    }, [user, token])

    useEffect(() => {
        if (user && token)
            loadAchievements();
    }, [user, token])

    return (
        <div
            className="flex"
            style={{ flex: '5', gap: '30px', minWidth: '800px' }}
        >

            <History />

            <div
                className="profile-achievements"
                style={{ width: '300px'}}
            >
                <p className="profile-history-title">Achievements</p>
                <div
                    className="flex-column"
                    style={{ marginTop: '15px', gap: '10px', alignItems: 'center'}}
                >
                    <AchievementsLabel
                        image={novice}
                        title="Novice"
                        description="Play 1 pong match"
                        valid={achievement && achievement.Novice}
                    />
                    <AchievementsLabel
                        image={intermediate}
                        title="Intermediate"
                        description="Play 5 pong matches"
                        valid={achievement && achievement.Intermediate}
                    />
                    <AchievementsLabel
                        image={expert}
                        title="Expert"
                        description="Play 10 pong matches"
                        valid={achievement && achievement.Expert}
                    />
                    <AchievementsLabel
                        image={master}
                        title="Master"
                        description="Play 20 pong matches"
                        valid={achievement && achievement.Master}
                    />
                    <AchievementsLabel
                        image={onfire}
                        title="On fire"
                        description="Achieve 5 wins in a row"
                        valid={achievement && achievement.OnFire}
                    />
                    <AchievementsLabel
                        image={tenacious}
                        title="Tenacious"
                        description="Experience 5 losses in a row"
                        valid={achievement && achievement.Tenacious}
                    />
                </div>
            </div>

        </div>
    )
}

