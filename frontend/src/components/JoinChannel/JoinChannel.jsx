import { useEffect } from 'react';
import { useState } from 'react';
import { BackApi } from '../../api/back';
import { PublicChannels } from '../PublicChannels/PublicChannels';
import s from './style.module.css'

export function JoinChannel({ myChannels }) {

	const [channels, setChannels] = useState();

	async function getAllChannels() {
		const rep = await BackApi.getAllChannels();
		if (rep.status === 200) {
			setChannels(rep.data);
		}
	}

	useEffect(() => {
		getAllChannels();
	}, [])

	return (
		<div>
			Public channels
			{channels && <PublicChannels channels={channels} myChannels={myChannels}/>}
		</div>
	);
}