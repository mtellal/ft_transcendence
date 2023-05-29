import s from './style.module.css'

export function PublicChannelsList({ channel }) {
	return (
		<div>
			<button>{channel.name}</button>
		</div>
	);
}
