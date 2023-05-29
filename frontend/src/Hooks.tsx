import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import { FriendsContext } from "./contexts/Chat/FriendsContext";
import { ChatSocketContext } from "./contexts/Chat/ChatSocketContext";
import { ChannelsContext } from "./contexts/Chat/ChannelsContext";

export function useUser()
{
    return (useContext(UserContext));
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