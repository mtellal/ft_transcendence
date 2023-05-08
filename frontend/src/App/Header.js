import React, { useContext } from 'react';

import './Header.css'

import imgLogin from '../assets/user.png'
import { Link } from 'react-router-dom';
import { UserContext } from '../App';


export default function Header()
{
    const [user, token, image] = useContext(UserContext);

    return (
        <header className='header'>
            <p className='header-pong'>Pong</p>
            <div className='pp-container'>
                <Link 
                    className='pp-link'
                    to={"/profile"}
                >
                    <img 
                        className='pp'
                        src={image}
                    />
                <p className='pp-user'>{user.username}</p>
                </Link>
            </div>
        </header>
    )
}