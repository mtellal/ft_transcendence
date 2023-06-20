import React, { useEffect } from "react";

import { Link } from "react-router-dom";

import './AddChannel.css'
import ArrowBackMenu from "../components/ArrowBackMenu";
import { useWindow } from "../../../hooks/useWindow";


export default function AddChannel() {

    const { isMobileDisplay } = useWindow();
    return (
        <div className="fill flex-column addchannel">
            {
                isMobileDisplay &&
                <div className="flex">
                    <ArrowBackMenu 
                        title="Menu"
                    />
                </div>
            }
            <div className="flex-center fill">

                <div className="flex-column-center addchannel-button-container">
                    <Link to={"join"} className="button flex-center add-channel-button">
                        Join a Channel
                    </Link>
                    <Link to={"create"} className="button flex-center add-channel-button">
                        Create a Channel
                    </Link>
                </div>
            </div>
        </div>
    )
}
