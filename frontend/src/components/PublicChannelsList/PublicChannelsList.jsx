import s from './style.module.css'

export function PublicChannelsList({ channel, socket }) {

	function joinChannel() {
		socket.emit('joinChannel', {
			channelId: channel.id
		})
	}

	return (
		<div>
			<button onClick={joinChannel}>{channel.name}</button>
		</div>
	);
}
