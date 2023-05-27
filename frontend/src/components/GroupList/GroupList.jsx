import s from './style.module.css'

export function GroupList({ channel, setIdFriendSelected }) {
	return (
        <div>
			<button>{channel.id}</button>
        </div>
	);
}