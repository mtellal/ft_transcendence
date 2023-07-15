
import React from "react"

import './ProfilePicture.css'

type TProfilePicture = {
    image: string
    boxShadow?: boolean
    style?: any
}

export default function ProfilePicture({image, boxShadow, style} : TProfilePicture) {
    return (
        <div className={boxShadow ? 'pp-round flex-center shadow': 'pp-round flex-center'}
            style={style}
        >
            <img
                className='pp'
                src={image}
            />
        </div>
    )
}
