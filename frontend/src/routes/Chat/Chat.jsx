import { useSelector } from 'react-redux';
import { Friends } from '../../components/Friends/Friends';
import s from './style.module.css'
import { useEffect, useState } from 'react';
import { BackApi } from '../../api/back';

export function Chat() {

    const [friends, setFriends] = useState([]);
    const selector = useSelector(store => store.USER.user);

    async function getFriends() {
        const response = await BackApi.getFriendsById(selector.id);

        // console.log('response.data', response.data);
        // console.log('response.data.len', response.data.length);

        if (response.data.length > 0) {
            if (response.status === 200) {
                // console.log('Friend list OK')
                setFriends(response.data);
                // console.log('friends', friends);
            } else {
                // console.log('Friend list NOT OK')
            }
        }
    }

    useEffect(() => {
        console.log('useEffect');
        getFriends();
    }, [])

    // console.log('friends', friends);
    // console.log('friends.len', friends.length);

    return (
        <div className={s.container}>
            <div className={s.item}>
                {friends.length > 0 && <Friends friends={friends} />}
            </div>
        </div>
    );
}