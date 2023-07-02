import React, { VoidFunctionComponent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updateProfilePicture, updateUser } from "../../requests/user";

import InfoInput from "../../components/Input/InfoInput";

import { useCurrentUser } from "../../hooks/Hooks";

import PickMenu from "../../components/PickMenu";
import { enable2FARequest, getQRCodeRequest } from "../../requests/2fa";
import useFetchUsers from "../../hooks/useFetchUsers";
import { HistoryMatchs } from "../../components/HistoryMatchs/HistoryMatchs";
import { Stats } from "../../components/Stats/Stats";
import { Achievements } from "../../components/Achievements/Achievements";


import Switch from 'react-switch';

import arrowRight from '../../assets/ArrowRight.svg'
import arrowBottom from '../../assets/ArrowBottom.svg'

import ProfilePicture from "../../components/users/ProfilePicture";

import './Profile.css'
import { User } from "../../types";

type TProfileInfos = {
    id: number,
    updateCurrentUser: (u: User) => void,
    username: string,
}

function ProfileInfos({ id, updateCurrentUser, ...props }: TProfileInfos) {
    const { token } = useCurrentUser();

    const [username, setUsername]: [string, any] = React.useState(props.username);
    const [error, setError] = React.useState("");
    const [updated, setUpdated] = React.useState(false);
    const prevUsernameRef = useRef(props.username);

    async function updateProfile() {
        setError(null);
        setUpdated(false);
        if (!username || !username.trim())
            return setError("Username required and can't be empty");
        if (username.trim().length > 20)
            return setError("Username too long (20 chars max)");
        if (username.trim().match(/[^a-zA-Z0-9 ]/g))
            return setError("Username invalid (only alphanumeric characters)")

        if (prevUsernameRef.current.trim() !== username.trim()) {
            await updateUser({
                username: username.trim(),
                userStatus: "ONLINE"
            }, id, token)
                .then(d => {
                    if (d.status === 200 || d.statusText === "OK") {
                        setUpdated(true);
                        updateCurrentUser(d.data);
                        prevUsernameRef.current = username;
                    }
                    else {
                        return setError("Username already taken by another user")
                    }
                })
                .catch(() => setError("Bad username"))
        } else {
            return setError("Same username")
        }
    }

    return (
        <div
            className="flex"
            style={{ padding: '4%', gap: '20px' }}
        >
            <div>
                {error && <p className='reset red-c' style={{ marginBottom: '10px' }} >{error}</p>}
                {updated && <p className='reset green-c' style={{ marginBottom: '10px' }} >Profile updated</p>}
                <div style={{ width: '150px' }}>
                    <InfoInput
                        id={id}
                        label="Username"
                        value={username}
                        setValue={setUsername}
                        submit={updateProfile}
                        maxLength={20}
                    />
                </div>
            </div>

            <button
                onClick={updateProfile}
                className="profile-c1-button"
                style={{ alignSelf: 'flex-end' }}
            >
                Update
            </button>
        </div>
    )
}


function RProfilePicture({ token, image, setImage }: any) {
    const [error, setError] = useState("");

    async function editProfilePicture(e: any) {
        setError("");
        const file = e.target.files[0];
        if (file && file.size > 5000000)
            return setError("File too large (5 Mb max)")
        if (file && file.type.match("image.*")) {
            let url = window.URL.createObjectURL(e.target.files[0]);
            setImage(url);
            updateProfilePicture(file, token)
        }
        else
            setError("Invalid file");
    }

    return (
        <div className="flex-column" style={{ padding: "4%" }}>
            {error && <p className="red-c reset" >{error}</p>}
            <div className="flex" style={{ justifyContent: 'space-between', marginTop: '10px' }}>
                <p className="reset">Import a new profile picture</p>
                <form >
                    <label
                        htmlFor="edit"
                        className="profil-picture-label"
                    >
                        choose a file
                    </label>
                    <input
                        id="edit"
                        type="file"
                        placeholder="edit"
                        className="profile-picture-input"
                        onChange={editProfilePicture}
                    />
                </form>
            </div>
        </div>
    )
}

function Enable2FA() {
    const { user, token, updateCurrentUser } = useCurrentUser();
    const { fetchUser } = useFetchUsers();
    const [selected, setSelected] = useState("false");
    const [updated, setUpdated] = useState(false);

    const [qrcode, setQrCode] = useState(null);

    useEffect(() => {
        if (user && user.twoFactorStatus)
            setSelected(`${user.twoFactorStatus}`)
    }, [user])

    function convertBase64ToBlob(base64Image: string) {
        const parts = base64Image.split(';base64,');
        const imageType = parts[0].split(':')[1];
        const decodedData = window.atob(parts[1]);
        const uInt8Array = new Uint8Array(decodedData.length);
        for (let i = 0; i < decodedData.length; ++i) {
            uInt8Array[i] = decodedData.charCodeAt(i);
        }
        return new Blob([uInt8Array], { type: imageType });
    }

    const generateQrCode = useCallback(async () => {
        if (token) {
            await getQRCodeRequest(token)
                .then(async (res: any) => {
                    if (res.data) {
                        let blob = convertBase64ToBlob(res.data.qrcode);
                        const url = window.URL.createObjectURL(blob)
                        setQrCode(url);
                        const updatedUser = await fetchUser(user.id);
                        updateCurrentUser(updatedUser);
                    }
                })
        }
    }, [token, fetchUser, updateCurrentUser, user]);


    useEffect(() => {
        if (token && user)
            generateQrCode();
    }, [token, user])


    return (
        <div className="flex-column" style={{padding: '4%'}}>
            <p className="reset profile-2fa-text1">Don’t forget to register this qr code and get access to the secret code associated.</p>
            <p className="reset profile-2fa-text2" style={{marginBottom: '10px'}}>You can’t login without the secret code.</p>
            {
                qrcode && 
                <div>
                    <img alt="qrcode" src={qrcode} />
                </div>
            }
            {updated && <p className="green-c" >updated</p>}
        </div >
    )
}



function ProfileC1(props: any) {

    const navigate = useNavigate();
    const [settings, setSettings] = useState(false);

    async function disconnect() {
        navigate("/login");
    }

    return (
        <div
            className="flex-column"
            style={{ flex: '1', marginRight: '5%' }}
        >

            <div style={{ height: '150px', width: '150px' }}>
                <ProfilePicture
                    image={props.user.url}
                />
            </div>
            <div
                className="flex-column reset"
            >
                <p
                    className="profile-c1-font-username reset"
                    style={{ marginTop: '15px', maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}
                >
                    {props.user.username}
                </p>
                <p
                    className="reset profile-c1-font-menu pointer"
                    style={settings ? { marginTop: '20px' } : { marginTop: '20px', color: 'black' }}
                    onClick={() => setSettings(false)}
                >
                    Profile
                </p>
                <p
                    className="reset profile-c1-font-menu pointer"
                    style={settings ? { marginTop: '8px', color: 'black' } : { marginTop: '8px' }}
                    onClick={() => setSettings(true)}
                >
                    Settings
                </p>
                <button
                    className="profile-c1-button"
                    style={{ marginTop: '22px' }}
                    onClick={() => disconnect()}
                >
                    Logout
                </button>
            </div>
        </div>
    )
}


type TProfileC2Label = {
    title: string,
    switch?: boolean,
    children: any, 
    onClick?: (p: boolean) => void,
}

function ProfileC2Label({ children, ...props }: TProfileC2Label) {

    const [show, setShow] = useState(false);

    return (
        <div
            className="profile-c2-label"
        >
            <div className="fill profile-c2-label-title"
                onClick={() => {
                    setShow((p: boolean) => !p)
                    if (props.onClick)
                        props.onClick(show);
                }}
            >
                <p>{props.title}</p>
                {
                    props.switch ?
                        <Switch
                            onChange={(p: boolean) => setShow(p)}
                            checked={show}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            onHandleColor="#5856D6"
                            onColor="#A2A0EF"
                            handleDiameter={30}
                            height={25}
                        /> :
                        <img
                            src={show ? arrowBottom : arrowRight}
                        />
                }
            </div>
            {show && children}
        </div>
    )
}

export default function Profile() {

    const {
        token,
        user,
        updateCurrentUser,
        updateCurrentProfilePicture
    }: any = useCurrentUser();

    return (
        <div className="profile flex scroll">

            <ProfileC1 user={user} />



            <div style={{ flex: '5' }}>
                <div className="flex-column profile-c2" style={{ maxWidth: '700px' }}>
                    <ProfileC2Label
                        title="Update your username"
                    >
                        <ProfileInfos
                            id={user.id}
                            username={user.username}
                            updateCurrentUser={updateCurrentUser}
                        />
                    </ProfileC2Label>
                    <ProfileC2Label
                        title="Update your profile picture"
                    >
                        <RProfilePicture
                            token={token}
                            image={user.url}
                            setImage={updateCurrentProfilePicture}
                        />
                    </ProfileC2Label>
                    <ProfileC2Label
                        title="Enable authentification 2FA"
                        switch={true}
                        onClick={async (p: boolean) => await enable2FARequest(p, token)}
                    >
                        <Enable2FA />
                    </ProfileC2Label>
                </div>

            </div>

        </div>
    )
}

