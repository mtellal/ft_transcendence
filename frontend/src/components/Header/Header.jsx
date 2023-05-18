import { useNavigate } from 'react-router-dom';
import s from './style.module.css'

export function Header() {

	const navigate = useNavigate();

	return (
		<div className={s.container}>
			<ul className={s.tabs}>
				<li className={s.element} onClick={() => navigate('/signin')}>Game</li>
				<li className={s.element} onClick={() => navigate('/profile')}>Profile</li>
				<li className={s.element} onClick={() => navigate('/chat')}>Chat</li>
			</ul>
		</div>
	);
}