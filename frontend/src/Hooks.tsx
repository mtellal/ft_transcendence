import React, { useContext } from "react";
import { UserContext } from "./contexts/UserContext";
import { FriendsContext } from "./contexts/Chat/FriendsContext";
import { ConversationsContext } from "./contexts/Chat/ConversationsContexts";

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