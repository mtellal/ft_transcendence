import React, { useContext } from 'react';

import './Header.css'

import { Link } from 'react-router-dom';
import { useUser } from '../Hooks';
import ProfilePicture from '../Components/ProfilePicture';

export default function Header() {
    const { user, image } = useUser();

    return (
        <header className='header'>
            <p className='header-pong'>Pong</p>
            <div className='pp-container'>
                <Link
                    className='pp-link'
                    to={"/profile"}
                >
                    <ProfilePicture image={image} />
                    <p className='pp-username'>{user.username}</p>
                </Link>
            </div>
        </header>
    )
}