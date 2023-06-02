import { useContext } from "react";
import { CurrentUserContext } from "./contexts/CurrentUserContext";
import { FriendsContext } from "./contexts/Chat/FriendsContext";
import { ChatSocketContext } from "./contexts/Chat/ChatSocketContext";
import { ChannelsContext } from "./contexts/Chat/ChannelsContext";
import { ChannelsUsersContext } from "./contexts/Chat/ChannelsUsersContext";

export function useCurrentUser()
{
    return (useContext(CurrentUserContext));
}

export function useFriends()
{
    return (useContext(FriendsContext));
}

export function useChatSocket()
{
    return (useContext(ChatSocketContext))
}

export function useChannels()
{
    return (useContext(ChannelsContext));
}

export function useChannelsUsers()
{
    return (useContext(ChannelsUsersContext))
}