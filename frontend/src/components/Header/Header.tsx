import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { HeaderProfile } from '../HeaderProfile/HeaderProfile';
import { RootState } from '../../store';
import { initializeSocket, getSocket } from '../../utils/socket';
import s from './style.module.css'


export function Header() {
	
	const navigate = useNavigate();
    const selector = useSelector((store: RootState) => store.user.user);
	
	useEffect(() => {
		if (selector.token) {
			initializeSocket(selector.token);
		}
	}, [selector.token])
	return (
		<div className={s.container}>
			<ul className={s.tabs}>
				<li className={s.element} onClick={() => navigate('/signin')}>Game</li>
				<li className={s.element} onClick={() => navigate('/profile')}>Profile</li>
				<li className={s.element} onClick={() => navigate('/chat')}>Chat</li>
				<li className={s.element}>{selector.username}</li>
			</ul>
			<span className={s.profileInfos}><HeaderProfile selector={selector}/></span>
		</div>
	);
}