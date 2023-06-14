import React, { useState } from 'react';
import { deleteCookie } from '../../utils/auth';
import { useNavigate } from 'react-router-dom';
import s from './style.module.css'

export function HeaderProfile ({ selector }: {selector: any}) {

	const [showElement, setShowElement] = useState(false);
	const navigate = useNavigate();
	const image = selector.avatar;

	function disconnect() {
		deleteCookie('access_token');
		navigate('/signin');
	}

	return (
		<div
			className={s.container}
			onMouseEnter={() => setShowElement(true)}
			onMouseLeave={() => setShowElement(false)}
			onClick={disconnect}
			style={{backgroundColor: showElement ? 'rgba(0, 0, 0, 0.2)' : ''}}
		>
			{!showElement && selector.username}
			{!showElement && <img className={s.image} src={image} />}
			{showElement && <p className={s.disconnect}>DISCONNECT</p>}
		</div>
	);
}