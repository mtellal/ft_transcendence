import React, { createContext, useCallback, useEffect, useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useChannelsContext, useChatSocket, useCurrentUser, useFriendsContext } from "../../../hooks/Hooks";
import useFetchUsers from "../../../hooks/useFetchUsers";
import { getChannel } from "../../../requests/chat";
import { useChannels } from "../../../hooks/Chat/useChannels";
import useMembers from "../../../hooks/Chat/useMembers";
import { useFriends } from "../../../hooks/Chat/Friends/useFriends";



export default function ChannelsEvents({ children }: any) {
    const { user, token } = useCurrentUser();
    const { socket } = useChatSocket();
    const { channels, channelsDispatch } = useChannelsContext();

    const navigate = useNavigate();

    const { addedMember } = useMembers();

    const {
        addChannel,
        forceToLeaveChannel,
        updateChannelInfos,
    } = useChannels();

    useEffect(() => {
        if (socket && user) {

            /*
                triggered when a channel is created and the current user is an member
            */
            socket.on('newChannel', async (channel: any) => {
                console.log("NEW CHANNEL EVENT")
                if (channel) {
                    addChannel(channel, false);
                }
            })

            /*
                triggered when when channel infos are edited {name, password, access}
            */
            socket.on('updatedChannel', (channel: any) => {
                console.log("UPDATED CHANNEL EVENT")
                // name / password / type
                updateChannelInfos(channel);
            })

            /*
                triggered when a user join a channel
            */
            socket.on('joinedChannel', async (res: any) => {
                console.log("JOINED CHANNEL EVENT")
                if (res && res.userId && res.channelId)
                    addedMember(res.userId, res.channelId)
            })

            /*
                triggered when a member left a channel
            */
            socket.on('leftChannel', async (res: any) => {
                console.log("LEFT CHANNEL EVENT")
                if (res && res.userId && res.channelId) {
                    channelsDispatch({ type: 'removeMember', channelId: res.channelId, userId: res.userId })
                    channelsDispatch({ type: 'removeAdministrators', channelId: res.channelId, userId: res.userId })
                }
            })

            /*
                triggered when the owner has left the channel, a new owner is deisgnated
            */
            socket.on('ownerChanged', (res: any) => {
                console.log("OWNER CHANGED EVENT")
                console.log(res)
                if (res && res.channelId && res.userId)
                {
                    channelsDispatch({ type: 'ownerChanged', channelId: res.channelId, userId: res.userId })

                }
                // name / password / type
            })

            /*
                triggered when a user is added by a administrator
            */
            socket.on('addedtoChannel', async (res: any) => {
                console.log("ADDED CHANNEL EVENT")
                if (res && res.channelId && res.userId) {
                    if (res.userId === user.id) {
                        const channel = await getChannel(res.channelId, token).then(res => res.data);
                        if (channel) {
                            addChannel(channel, false);
                        }
                    }
                    else {
                        addedMember(res.userId, res.channelId)
                    }
                }
            })

            /*
                triggered when a the owner made admin a member
            */
            socket.on('madeAdmin', (res: any) => {
                console.log("MADE ADMIN CHANNEL EVENT");
                if (res && res.channelId && res.userId) {
                    channelsDispatch({ type: 'addAdministrators', channelId: res.channelId, userId: res.userId })
                }
            })

            /*
                triggered when a the owner demote an admin 
            */
            socket.on('removedAdmin', async (res: any) => {
                console.log("REMOVED ADMIN CHANNEL EVENT")
                if (res && res.channelId && res.userId) {
                    channelsDispatch({ type: 'removeAdministrators', channelId: res.channelId, userId: res.userId })
                }
            })

            /*
                triggered when a user is kicked by an admin
            */
            socket.on('kickedUser', async (res: any) => {
                console.log("KICKED CHANNEL EVENT")
                forceToLeaveChannel(res)
            })

            /*
                triggered when a user is muted by an admin
            */
            socket.on('mutedUser', async (res: any) => {
                console.log("MUTED USER CHANNEL EVENT", res)
                if (res && res.channelId && res.userId && res.mute) {
                    channelsDispatch({ type: 'addMuteList', channelId: res.channelId, userId: res.userId, mute: res.mute })
                }
            })

            /*
                triggered when a user is umuted by an admin
            */
            socket.on('unmutedUser', async (res: any) => {
                console.log("UNMUTED USER CHANNEL EVENT", res)
                if (res && res.channelId && res.userId) {
                    channelsDispatch({ type: 'removeMuteList', channelId: res.channelId, userId: res.userId })
                }
            })

            /*
                triggered when a user is banned by an admin
            */
            socket.on('bannedUser', async (res: any) => {
                console.log("BANNED CHANNEL EVENT")
                if (res && res.channelId && res.userId) {
                    channelsDispatch({ type: 'addBanList', channelId: res.channelId, userId: res.userId });
                    forceToLeaveChannel(res)
                }
            })

            /*
                triggered when a user is unbanned by an admin
            */
            socket.on('unbannedUser', (res: any) => {
                console.log("UNBANNED CHANNEL EVENT")
                if (res && res.channelId && res.userId) {
                    console.log("res => ", res, channels)
                    channelsDispatch({ type: 'removeBanList', channelId: res.channelId, userId: res.userId })
                }
            })


            /*
                triggered when the channel is joined the first time (load all previous messages), 
                and is triggered when a message is send 
            */

            if (channels && channels.length) {
                socket.on('message', (m: any) => {
                    console.log("message recieved")
                    if (m.length) {
                        channelsDispatch({ type: 'initMessages', messages: m });
                    }
                    if (m.content) {
                        channelsDispatch({ type: 'addMessage', message: m });
                    }
                });
            }


            socket.on('updatedMember', async (user: any) => {
                console.log("UPDATE USER CHANNEL FRIEND EVENT => ")
                /* if (user)
                {
                    if (isUserFriend(user))
                        updateFriend(user);
                } */
            })

            return () => {
                if (socket) {
                    socket.off('newChannel')
                    socket.off('updatedChannel')
                    socket.off('joinedChannel')
                    socket.off('leftChannel')
                    socket.off('addedtoChannel')
                    socket.off('madeAdmin')
                    socket.off('removedAdmin')
                    socket.off('kickedUser')
                    socket.off('bannedUser')
                    socket.off('unbannedUser')
                    if (channels && channels.length)
                        socket.off('message')
                    socket.off('mutedUser')
                    socket.off('unmutedUser')
                    socket.off('updatedMember')
                }
            }
        }
    }, [socket, channels, user])

    return (children)
}