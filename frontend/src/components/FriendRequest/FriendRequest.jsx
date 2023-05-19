import { useEffect, useState } from "react";
import { BackApi } from "../../api/back";
import { FriendRequestList } from "../FriendRequestList/FriendRequestList";

export function FriendRequest({ listFriendRequest }) {

	// const [friendRequest, setFriendRequest] = useState([]);

	// async function getFriendRequest() {
	// 	const response = await BackApi.getFriendRequest(id);
	// 	setFriendRequest(response.data);
	// }

	// useEffect(() => {
	// 	if (id) {
	// 		getFriendRequest();
	// 	}
	// }, [])

	console.log('component');

	return (
		<div>
			{listFriendRequest.map((request) => {
				return (
					<span key={request.id}>
						<FriendRequestList friendId={request.sendBy} />
					</span>
				);
			})}
		</div>
	);
}