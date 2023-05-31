import React, { useEffect, useState } from "react";
import { UserInfos } from "../../Components/FriendElement";
import './Banner.css'
import Icon from "../../Components/Icon";
import { useChannels, useChannelsUsers, useFriends, useUser } from "../../Hooks";
import { getUserProfilePictrue } from "../../utils/User";
import ProfilePicture from "../../Components/ProfilePicture";


function ChannelInfos(props: any) {

    const { user, image } = useUser();
    const { channelsUsers, getMembers } = useChannelsUsers();
    const { currentChannel } = useChannels();

    const [renderMembersPP, setRenderMembersPP] = useState([]);

    async function loadMembers() {
        let members = getMembers(currentChannel.id);
        if (members && members.length) {
            members = members.map((u: any) => u.id);
            members = await Promise.all(members.map(async (id: number) =>
                await getUserProfilePictrue(id).
                    then(res => window.URL.createObjectURL(new Blob([res.data])))
            ))
            setRenderMembersPP(
                members.map((url: string) =>
                    <div key={url} className="channelinfos-pp-container">
                        <ProfilePicture image={url} />
                    </div>
                )
            );
        }
    }

    useEffect(() => {
        setRenderMembersPP([])
        if (currentChannel) {
            loadMembers();
        }
    }, [currentChannel, channelsUsers])

    return (
        <div className="flex-center">
            <h2 style={{ whiteSpace: 'nowrap' }}>{props.name} - </h2>
            <div className="flex-center channelinfos-members-container">
                {renderMembersPP}
            </div>
        </div>
    )
}



export default function Banner({ ...props }: any) {

    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();

    const [friend, setFriend]: any = useState();
    const [channel, setChannel]: any = useState();

    useEffect(() => {
        setFriend(null);
        if (currentFriend)
            setFriend(currentFriend)
    }, [currentFriend])

    useEffect(() => {
        setChannel(null);
        if (currentChannel)
            setChannel(currentChannel)
    }, [currentChannel])

    console.log(channel)

    return (
        <div className="banner">
            {
                channel && channel.type === "WHISPER" ?
                    <UserInfos
                        id={friend && friend.id}
                        username={friend && friend.username}
                        userStatus={friend && friend.userStatus}
                        profilePictureURL={friend && friend.url}
                        userAvatar={friend && friend.avatar}
                    />
                    :
                    <ChannelInfos
                        name={channel && channel.name}
                    />
            }
            <div className="flex-center banner-icon-container">
                {
                    channel && channel.type === "WHISPER" ?
                    <Icon icon="person" onClick={props.profile} description="Profile" />
                    : <Icon icon="groups" onClick={props.profile} description="Channel" />
                }
                <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
                <Icon icon="block" onClick={props.block} description="Block" />
                {
                    channel && channel.type === "WHISPER" ?  
                    <Icon icon="person_remove" onClick={props.remove} description="Remove" />
                    :
                    <Icon icon="logout" onClick={props.remove} description="Logout" />
                }
            </div>
        </div>
    )
}
