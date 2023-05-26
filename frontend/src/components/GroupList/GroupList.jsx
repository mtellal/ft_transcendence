import s from './style.module.css'

export function GroupList({ channel }) {
	return (
        <div>
			<button>{channel.id}</button>
        </div>
	);
}