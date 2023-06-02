
import React from "react"

import './ProfilePicture.css'

export default function ProfilePicture({image} : any) {
    return (
        <div className='pp-round flex-center'>
            <img
                className='pp'
                src={image}
            />
        </div>
    )
}
