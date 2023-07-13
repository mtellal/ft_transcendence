import { useContext } from "react";
import { CurrentUserContext } from "../contexts/CurrentUserContext";
import { FriendsContext } from "../contexts/FriendsContext";
import { ChatSocketContext } from "../contexts/ChatSocketContext";
import { ChannelsContext } from "../contexts/ChannelsContext";

export function useCurrentUser()
{
    return (useContext(CurrentUserContext));
}

export function useFriendsContext()
{
    return (useContext(FriendsContext));
}

export function useChatSocket()
{
    return (useContext(ChatSocketContext))
}

export function useChannelsContext()
{
    return (useContext(ChannelsContext));
}
