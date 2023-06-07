import React from "react";
import { ChannelUserList } from "../ChannelUserList/ChannelUserList";

export function ChannelUsers({dataChannel}: {dataChannel: any}) {

	const usersChan = dataChannel.members;

	console.log('TEST')

	return (
		<div>
			{usersChan.map((user: any) => {
				return (
					<span key={user}>
						<ChannelUserList user={user} dataChannel={dataChannel}/>
					</span>
				);
			})}
		</div>
	);
}