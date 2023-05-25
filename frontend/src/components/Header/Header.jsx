import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import s from './style.module.css'

export function Header() {

	const navigate = useNavigate();
    const selector = useSelector(store => store.USER.user);

	return (
		<div className={s.container}>
			<ul className={s.tabs}>
				<li className={s.element} onClick={() => navigate('/signin')}>Game</li>
				<li className={s.element} onClick={() => navigate('/profile')}>Profile</li>
				<li className={s.element} onClick={() => navigate('/chat')}>Chat</li>
				<li className={s.element}>{selector.username}</li>
			</ul>
		</div>
	);
}