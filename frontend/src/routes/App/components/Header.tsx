import React from 'react';

import { Link } from 'react-router-dom';
import { useCurrentUser } from '../../../hooks/Hooks';
import ProfilePicture from '../../../components/users/ProfilePicture';

import './Header.css'

export default function Header() {
    const { user } = useCurrentUser();

    return (
        <header className='header'>
            <p className='header-pong'>Pong</p>
            <div className='header-userinfos-container'>
                <Link
                    className='pp-link'
                    to={`/user/${user.id}`}
                >
                    <div className='header-pp-container'>
                        <ProfilePicture image={user && user.url} boxShadow={true} />
                    </div>
                    <p className='pp-username'>{user.username}</p>
                </Link>
            </div>
        </header>
    )
}