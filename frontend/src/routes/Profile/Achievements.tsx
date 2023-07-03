import React, { useCallback, useEffect, useState } from "react";

import { useCurrentUser } from "../../hooks/Hooks";

import { getAchievements } from "../../requests/user";
import novice from '../../assets/novice.png'
import intermediate from '../../assets/intermediate.png';
import expert from '../../assets/expert.png';
import master from '../../assets/master.png';
import onfire from '../../assets/fire.png';
import tenacious from '../../assets/tenacious.png';

import './Profile.css'
import { User } from "../../types";


function AchievementsLabel({ image, title, description, valid }: any) {
    return (
        <div
            className="profile-achievements-label flex-center"
            style={!valid ? { backgroundColor: '#CCC' } : {}}>
            <img
                className="profile-achievements-label-image"
                src={image}
            />
            <div className="profile-achievements-label-infos flex-column"
            >
                <p className="profile-c1-font-username">{title}</p>
                <p
                    className="profile-2fa-text2"
                    style={{ marginTop: '5px' }}
                >
                    {description}
                </p>
            </div>
        </div>
    )
}

type TAchievements = {
    user: User
}

export function Achievements({user}: TAchievements) {

    const { token } = useCurrentUser();

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
            className="profile-achievements"
            style={{ width: '300px' }}
        >
            <p className="profile-history-title">Achievements</p>
            <div
                className="flex-column"
                style={{ marginTop: '15px', gap: '10px', alignItems: 'center' }}
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
                    description="Win 5 pong matches"
                    valid={achievement && achievement.Intermediate}
                />
                <AchievementsLabel
                    image={expert}
                    title="Expert"
                    description="Win 10 pong matches"
                    valid={achievement && achievement.Expert}
                />
                <AchievementsLabel
                    image={master}
                    title="Master"
                    description="Win 20 pong matches"
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
    )
}