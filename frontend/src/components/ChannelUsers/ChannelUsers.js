import React from "react";
import { ChannelUserList } from "../ChannelUserList/ChannelUserList";
export function ChannelUsers({ dataChannel }) {
    const usersChan = dataChannel.members;
    return (React.createElement("div", null, usersChan.map((user) => {
        return (React.createElement("span", { key: user },
            React.createElement(ChannelUserList, { user: user, dataChannel: dataChannel })));
    })));
}
