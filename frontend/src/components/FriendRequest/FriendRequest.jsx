import { FriendRequestList } from "../FriendRequestList/FriendRequestList";

export function FriendRequest({ listFriendRequest, setFriendRequest }) {

	// console.log('Component FriendRequest len', listFriendRequest.length);

	if (listFriendRequest.length === 0) {
		return (
			<div>Pas de demande d'ami</div>
		);
	}

	return (
		<div>
			{listFriendRequest.map((request) => {
				return (
					<span key={request.id}>
						<FriendRequestList
							friendId={request.sendBy}
							requestId={request.id}
							listFriendRequest={listFriendRequest}
							setFriendRequest={setFriendRequest}
						/>
					</span>
				);
			})}
		</div>
	);
}