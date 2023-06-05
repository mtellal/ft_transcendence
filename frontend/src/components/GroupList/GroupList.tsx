import React from 'react';
import s from './style.module.css'

interface GroupListProps {
	channel: any;
	setidChannelSelected: any;
}

export function GroupList({ channel, setidChannelSelected }:  GroupListProps) {

	function setIdChannel() {
		setidChannelSelected(channel.id);
	}

	return (
        <div>
			<button onClick={setIdChannel}>{channel.name ? channel.name : channel.id}</button>
        </div>
	);
}