import React, { useCallback, useEffect, useRef, useState } from "react";
import { updateProfilePictureRequest, updateUser } from "../../requests/user";

import InfoInput from "../../components/Input/InfoInput";

import { useCurrentUser } from "../../hooks/Hooks";

import { enable2FARequest, getQRCodeRequest } from "../../requests/2fa";


import Switch from 'react-switch';

import arrowRight from '../../assets/ArrowRight.svg'
import arrowBottom from '../../assets/ArrowBottom.svg'

import { User } from "../../types";
import './Profile.css'

type TUpdateProfileUsername = {
    id: number,
    updateCurrentUser: (u: User) => void,
    username: string,
}

function UpdateProfileUsername({ id, updateCurrentUser, ...props }: TUpdateProfileUsername) {
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

        if (prevUsernameRef.current.trim() === username.trim())
            return setError("Same username")
        else {
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


function UpdateProfilePicture({ token, setImage }: any) {
    const [error, setError] = useState("");

    async function editProfilePicture(e: any) {
        setError("");
        const file = e.target.files[0];
        if (file && file.size > 5000000)
            return setError("File too large (5 Mb max)")
        if (file && file.type.match("image.*")) {
            let url = window.URL.createObjectURL(e.target.files[0]);
            setImage(url);
            updateProfilePictureRequest(file, token)
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

function Authentification2FA() {
    const { user, token } = useCurrentUser();
    const [qrcode, setQrCode] = useState(null);

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
                    }
                })
        }
    }, [token, user]);

    useEffect(() => {
        if (token && user && user.twoFactorStatus)
            generateQrCode();
    }, [token, user])

    return (
        <div className="flex-column" style={{ padding: '4%' }}>
            <p className="reset profile-2fa-text1">Don’t forget to register this qr code and get access to the secret code associated.</p>
            <p className="reset profile-2fa-text2" style={{ marginBottom: '10px' }}>You can’t login without the secret code.</p>
            {
                qrcode &&
                <div>
                    <img alt="qrcode" src={qrcode} />
                </div>
            }
        </div >
    )
}




type TProfileSettingsLabel = {
    title: string,
    switch?: boolean,
    children: any,
}

function ProfileSettingsLabel({ children, ...props }: TProfileSettingsLabel) {

    const { token, user, updateCurrentUser } = useCurrentUser();
    const [show, setShow] = useState(false);
    const [enable2FA, setEnable2FA] = useState(user && user.twoFactorStatus);

    return (
        <div
            className="profile-c2-label"
        >
            <div className="fill profile-c2-label-title"
                onClick={async () => {
                    if (props.switch) {
                        setShow(!enable2FA)
                        setEnable2FA((p: boolean) => !p);
                        await enable2FARequest(!enable2FA, token);
                        updateCurrentUser({ ...user, twoFactorStatus: !enable2FA })
                    }
                    else
                        setShow((p: boolean) => !p);
                }}
            >
                <p>{props.title}</p>
                {
                    props.switch ?
                        <Switch
                            onChange={() => { }}
                            checked={enable2FA}
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



export default function Settings() {
    const {
        token,
        user,
        updateCurrentUser,
        updateCurrentProfilePicture
    }: any = useCurrentUser();
    return (
        <div style={{ flex: '5' }}>
            <div className="flex-column profile-c2" style={{ maxWidth: '700px' }}>
                <ProfileSettingsLabel
                    title="Update your username"
                >
                    <UpdateProfileUsername
                        id={user.id}
                        username={user.username}
                        updateCurrentUser={updateCurrentUser}
                    />
                </ProfileSettingsLabel>
                <ProfileSettingsLabel
                    title="Update your profile picture"
                >
                    <UpdateProfilePicture
                        token={token}
                        image={user.url}
                        setImage={updateCurrentProfilePicture}
                    />
                </ProfileSettingsLabel>
                <ProfileSettingsLabel
                    title="Enable authentification 2FA"
                    switch={true}
                >
                    <Authentification2FA />
                </ProfileSettingsLabel>
            </div>

        </div>
    )
}
