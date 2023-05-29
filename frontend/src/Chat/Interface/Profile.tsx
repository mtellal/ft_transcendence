import React from "react"

import './Profile.css'
import { useChannels, useFriends } from "../../Hooks"

export default function Profile()
{
    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();

    return (
        <div className="flex-column-center profile-interface">
            <p>Profile page (require stats, history, and others datas)</p>

        </div>
    )
}
