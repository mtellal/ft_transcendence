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
                    <div style={{height: '60%', padding: '0 5px'}}>
                        <ProfilePicture image={image} />
                    </div>
                    <p className='pp-username'>{user.username}</p>
                </Link>
            </div>
        </header>
    )
}