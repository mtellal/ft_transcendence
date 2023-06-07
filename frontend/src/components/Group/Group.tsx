import React from 'react';
import { BackApi } from '../../api/back';
import { GroupList } from '../GroupList/GroupList';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { io, Socket } from 'socket.io-client'
import s from './style.module.css'

interface GroupProps {
	myChannels: any;
	setidChannelSelected: any;
}

export function Group({ myChannels, setidChannelSelected }: GroupProps) {

	return (
		<div>
			<div className={s.list}>
				{myChannels.map((channel: any) => {
					if (channel.type !== 'WHISPER') {
						return (
							<span key={channel.id}>
								<GroupList channel={channel} setidChannelSelected={setidChannelSelected} />
							</span>
						);
					}
					return null;
				})}
			</div>
		</div>
	);
}