import React from "react";
import { FriendRequestList } from "../FriendRequestList/FriendRequestList";
export function FriendRequest({ listFriendRequest, setFriendRequest }) {
    if (listFriendRequest.length === 0) {
        return (React.createElement("div", null, "Pas de demande d'ami"));
    }
    return (React.createElement("div", null, listFriendRequest.map((request) => {
        return (React.createElement("span", { key: request.id },
            React.createElement(FriendRequestList, { friendId: request.sendBy, requestId: request.id, listFriendRequest: listFriendRequest, setFriendRequest: setFriendRequest })));
    })));
}
