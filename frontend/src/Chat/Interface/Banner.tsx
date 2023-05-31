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
        if (members)
        {
            members = members.map((u: any) => u.id);
            members = await Promise.all(members.map( async (id: number) => 
                await getUserProfilePictrue(id).
                    then(res => window.URL.createObjectURL(new Blob([res.data])))
            ))
            members = [image, ...members];
    
            setRenderMembersPP(
                members.map((url : string) => 
                    <div className="channelinfos-pp-container">
                        <ProfilePicture key={url} image={url}/>
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
            <h2 style={{whiteSpace:'nowrap'}}>{props.name} - </h2>
            <div className="flex-center channelinfos-members-container">
                {renderMembersPP}
            </div>
        </div>
    )
}



export default function Banner({ ...props }: any) {

    const { currentFriend } = useFriends();
    const { currentChannel } = useChannels();

    return (
        <div className="banner">
            {
                currentChannel && currentChannel.type === "WHISPER" ?
                    <UserInfos
                        id={currentFriend && currentFriend.id}
                        username={currentFriend && currentFriend.username}
                        userStatus={currentFriend && currentFriend.userStatus}
                        profilePictureURL={currentFriend && currentFriend.url}
                        userAvatar={currentFriend && currentFriend.avatar}
                    />
                    :
                    <ChannelInfos
                        name={currentChannel && currentChannel.name}
                    />
            }
            <div className="flex-center banner-icon-container">
                <Icon icon="person" onClick={props.profile} description="Profile" />
                <Icon icon="sports_esports" onClick={props.invitation} description="Invitation" />
                <Icon icon="block" onClick={props.block} description="Block" />
                <Icon icon="person_remove" onClick={props.remove} description="Remove" />
            </div>
        </div>
    )
}
