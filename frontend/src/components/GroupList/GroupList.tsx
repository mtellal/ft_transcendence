import React from 'react';
import s from './style.module.css'

interface GroupListProps {
	channel: any;
	setIdFriendSelected: any;
}

export function GroupList({ channel, setIdFriendSelected }:  GroupListProps) {

	function test() {
		setIdFriendSelected(channel.id);
	}

	return (
        <div>
			<button onClick={test}>{channel.name ? channel.name : channel.id}</button>
        </div>
	);
}