import React from 'react';
import s from './style.module.css'

interface GroupListProps {
	channel: any;
	setIdFriendSelected: any;
}

export function GroupList({ channel, setIdFriendSelected }:  GroupListProps) {

	function setIdChannel() {
		setIdFriendSelected(channel.id);
	}

	return (
        <div>
			<button onClick={setIdChannel}>{channel.name ? channel.name : channel.id}</button>
        </div>
	);
}