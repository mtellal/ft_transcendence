import { useSelector } from 'react-redux';
import { Friends } from '../../components/Friends/Friends';
import s from './style.module.css'
import { useEffect, useState } from 'react';
import { BackApi } from '../../api/back';
import { useNavigate } from 'react-router-dom';

export function Chat() {

    const [friends, setFriends] = useState([]);
    const selector = useSelector(store => store.USER.user);
    const navigate = useNavigate();

    async function getFriends() {
        const response = await BackApi.getFriendsById(selector.id);

        if (response.status === 200) {
            if (response.data.length > 0) {
                setFriends(response.data);
            }
        }
    }

    useEffect(() => {
        if (selector.id) {
            console.log('getFriends()');
            getFriends();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selector.id])

    return (
        <div className={s.container}>
            <div className={s.item}>
                {friends.length > 0 ? <Friends friends={friends} /> : `pas d'amis :( User: ${selector.username}`}
            </div>
            <button onClick={() => navigate('/profile')}>Profile</button>
        </div>
    );
}