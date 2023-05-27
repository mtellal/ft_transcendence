import s from './style.module.css'

export function GroupList({ channel, setIdFriendSelected }) {
	// console.log('channel.id', channel.id);

	function test() {
		setIdFriendSelected(channel.id);
	}

	return (
        <div>
			<button onClick={test}>{channel.id}</button>
        </div>
	);
}