import s from './style.module.css'

export function HeaderProfile ({ selector }) {

	const image = selector.avatar;

	return (
		<div className={s.container}>
			{selector.username}
			<img className={s.image} src={image} />
		</div>
	);
}