import React, { useState } from "react";

import './Sidebar.css'
import { NavLink, useLocation } from "react-router-dom";
import { useWindow } from "../../../hooks/useWindow";

import profile from '../../../assets/User.svg'
import game from '../../../assets/Gamepad.svg'
import ladder from '../../../assets/Users.svg'
import chat from '../../../assets/Chat.svg'
import { useCurrentUser } from "../../../hooks/Hooks";

type TMenuElement = {
    path: string,
    image: any
}

function MenuElement(props: TMenuElement) {

    return (
        <NavLink
            to={props.path}
            className={({ isActive }) => isActive ?
                "selected flex-column-center pointer menu--element" :
                "flex-column-center pointer menu--element"
            }
        >
            <img
                style={{ height: '30%' }}
                src={props.image}
            />
        </NavLink>
    )
}


type TMenuElementMobile = {
    title: string,
    path: string,
    image: any,
    setSelected: (s: string) => void
}

function MenuElementMobile(props: TMenuElementMobile) {

    return (
        <NavLink
            onClick={() => props.setSelected(props.title)}
            to={props.path}
            className={({ isActive }) => isActive ?
                "selected flex-ai pointer menu--element" :
                "flex-ai pointer menu--element"
            }
        >
            <img
                style={{ height: '40%', padding: '0 10px' }}
                src={props.image}
            />
            {props.title && <p>{props.title}</p>}
        </NavLink>
    )
}



function PickSideBar(props: any) {
    const [show, setShow] = useState(false);
    const {user} = useCurrentUser();

    function pickImage(s: string) {
        if (s === "Profile")
            return (profile)
        else if (s === "Game")
            return (game)
        else if (s === "Ladder")
            return (ladder)
        else if (s === "Chat")
            return (chat)
        return (null)
    }


    return (
        <div style={{ width: '100%', height: 'auto' }}>
            <div className="flex-column pointer" onClick={() => setShow(p => !p)}>
                <div className="flex-ai" style={show ? { borderBottom: '1px solid black' } : {}}>
                    <img
                        style={{ height: '40%', padding: '0 10px' }}
                        src={pickImage(props.selected)}
                    />
                    <p>{props.selected || "Menu ..."}</p>
                </div>

                {
                    show &&
                    <>

                        <MenuElementMobile
                            title="Profile"
                            path={`/user/${user.id}`}
                            image={profile}
                            setSelected={props.setSelected}
                        />
                        <MenuElementMobile
                            title="Game"
                            path="/game"
                            image={game}
                            setSelected={props.setSelected}
                        />
                        <MenuElementMobile
                            title="Ladder"
                            path="/ladder"
                            image={ladder}
                            setSelected={props.setSelected}
                        />
                        <MenuElementMobile
                            title="Chat"
                            path="/chat"
                            image={chat}
                            setSelected={props.setSelected}
                        />
                    </>
                }
            </div>
        </div>
    )
}

export default function Sidebar() {
    const [selected, setSelected] = useState("Game");
    const { isMobileDisplay } = useWindow();
    const {user} = useCurrentUser();

    return (
        <span className="flex-column sidebar">
            {
                isMobileDisplay ?
                    <PickSideBar
                        collection={[]}
                        selected={selected}
                        setSelected={setSelected}
                    />
                    :

                    <>
                        <MenuElement
                            path={`/user/${user.id}`}
                            image={profile}
                        />
                        <MenuElement
                            path="/game"
                            image={game}
                        />
                        <MenuElement
                            path="/ladder"
                            image={ladder}
                        />
                        <MenuElement
                            path="/chat"
                            image={chat}
                        />
                    </>

            }
        </span>
    )
}