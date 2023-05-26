import { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import { FriendsContext } from "./contexts/Chat/FriendsContext";
import { ConversationsContext } from "./contexts/Chat/ConversationsContexts";
import { ChatSocketContext } from "./contexts/Chat/ChatSocketContext";

export function useUser()
{
    return (useContext(UserContext));
}

export function useFriends()
{
    return (useContext(FriendsContext));
}

export function useConversations()
{
    return (useContext(ConversationsContext));
}

export function useChatSocketContext()
{
    return (useContext(ChatSocketContext))
}