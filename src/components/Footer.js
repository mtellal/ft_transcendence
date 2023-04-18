import React from 'react';

import '../styles/Footer.css'

export default function Footer()
{
    return (
        <footer className='footer'>
            <p className='footer--authors'>Project realised by {}
                <a 
                    className='author--link' 
                    href='https://profile.intra.42.fr/users/jdubilla' 
                    target="_blank" 
                    rel="noreferrer"
                >
                    jdubilla
                </a>{", "}
                <a 
                    className='author--link' 
                    href='https://profile.intra.42.fr/users/mtellal' 
                    target="_blank" 
                    rel="noreferrer"
                >
                    mtellal
                </a>{", "}
                <a 
                    className='author--link' 
                    href='https://profile.intra.42.fr/users/antbarbi' 
                    target="_blank" 
                    rel="noreferrer"
                >
                     antbarbi
                </a>{", "}
                <a 
                    className='author--link' 
                    href='https://profile.intra.42.fr/users/aessakhi' 
                    target="_blank" 
                    rel="noreferrer"
                >
                     aessakhi
                </a>
                
             </p>
            <p className='footer--copyright'>© All rights reserved</p>
        </footer>
    )
}