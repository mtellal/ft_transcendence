import React, { useContext } from 'react';

import './Header.css'

import { Link } from 'react-router-dom';
import { useUser } from '../Hooks';

export default function Header({profilePicture} : any)
{
    const {user, image} = useUser();

    return (
        <header className='header'>
            <p className='header-pong'>Pong</p>
            <div className='pp-container'>
                <Link 
                    className='pp-link'
                    to={"/profile"}
                >
                    <div className='pp-round'>
                        <img 
                            className='pp'
                            src={image}
                        />
                    </div>
                <p className='pp-username'>{user.username}</p>
                </Link>
            </div>
        </header>
    )
}