import React from "react";
import { ChannelUserList } from "../ChannelUserList/ChannelUserList";
import s from './style.module.css'

export function ChannelUsers({dataChannel}: {dataChannel: any}) {

	const usersChan = dataChannel.members;

	return (
		<div className={s.container}>
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