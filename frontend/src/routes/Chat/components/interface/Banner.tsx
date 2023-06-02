import React, { useCallback, useEffect, useState } from "react";
import { UserInfos } from "../../../../components/Users/UserLabel";
import './Banner.css'
import Icon from "../../../../components/Icon";
import { useChannels, useChannelsUsers, useFriends, useCurrentUser } from "../../../../Hooks";
import { getUserProfilePictrue } from "../../../../utils/User";
import ProfilePicture from "../../../../components/ProfilePicture";


function ChannelInfos(props: any) {

    const { user, image } = useCurrentUser();
    const { channelsUsers, getMembers } = useChannelsUsers();
    const { currentChannel } = useChannels();

    const [renderMembersPP, setRenderMembersPP] = useState([]);

    const loadMembers = useCallback(async () => {
        let members = getMembers(currentChannel.id);
        console.log(members, currentChannel)
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
    }, [currentChannel, channelsUsers])

    useEffect(() => {
        setRenderMembersPP([])
        if (currentChannel) {
            loadMembers();
        }
    }, [currentChannel, channelsUsers])

    console.log(currentChannel)

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

    const { user } = useCurrentUser();
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

    const pickRemoveIcon = useCallback(() => {
        if (channel) {
            if (channel.type === "WHISPER")
                return (
                    <Icon icon="person_remove" onClick={props.remove} description="Remove" />
                )
            else {
                if (channel.ownerId === user.id)
                    return (
                        <Icon icon="delete_forever" onClick={props.remove} description="Delete" />
                    )
                else
                    return (
                        < Icon icon="logout" onClick={props.remove} description="Leave" />
                    )
            }
        }
    }, [channel])


    return (
        <div className="banner">
            {
                channel && channel.type === "WHISPER" ?
                    <UserInfos
                        username={friend && friend.username}
                        userStatus={friend && friend.userStatus}
                        profilePictureURL={friend && friend.url}
                    />
                    :
                    <ChannelInfos
                        name={channel && channel.name}
                    />
            }
            <div className="banner-icon-container">
                {
                    channel && channel.type === "WHISPER" ?
                        <Icon icon="person" onClick={props.profile} description="Profile" />
                        : <Icon icon="groups" onClick={props.profile} description="Channel" />
                }
                <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
                <Icon icon="block" onClick={props.block} description="Block" />
                {
                    pickRemoveIcon()
                }
            </div>
        </div>
    )
}
