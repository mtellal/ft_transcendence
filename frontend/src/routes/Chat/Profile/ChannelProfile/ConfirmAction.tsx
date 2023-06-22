import React, { useContext, useState } from "react"
import InfoInput from "../../../../components/Input/InfoInput";

import ResizeContainer from "../../../../components/ResizeContainer";
import './ConfirmAction.css'
import useMuteUser from "../../../../hooks/Chat/useMuteUser";
import { useChannels } from "../../../../hooks/Chat/useChannels";
import { Channel, User } from "../../../../types";

type TConfirmAction = {
    setUserAction: any, 
    setConfirmView: any
    userAction: any
    channel: Channel
}

export function ConfirmAction(props: TConfirmAction) {

    function cancelAction() {
        props.setConfirmView((p: boolean) => !p);
        props.setUserAction(null)
    }

    function validAction() {
        props.setConfirmView((p: boolean) => !p);
        props.userAction.function(props.userAction.user, props.channel);
    }

    return (
        <ConfirmPage>
            {
                props.userAction ?
                    <>

                        {
                            props.userAction.type === "mute" &&
                            <ConfirmViewMuteAction
                                channel={props.channel}
                                user={props.userAction && props.userAction.user}
                                username={props.userAction.user && props.userAction.user.username}
                                setConfirmView={props.setConfirmView}
                                cancel={() => props.setConfirmView(false)}
                            />
                        }

                        {
                            props.userAction.type !== "mute" &&
                            <ConfirmView
                                type={props.userAction.type}
                                username={props.userAction.user && props.userAction.user.username}
                                cancel={() => cancelAction()}
                                valid={() => validAction()}
                            />
                        }
                    </>
                    :
                    <ConfirmViewTypeProteced
                        channel={props.channel}
                        setConfirmView={props.setConfirmView}
                        cancel={() => props.setConfirmView(false)}
                    />
            }
        </ConfirmPage>
    )
}

type TConfirmView = {
    type: string, 
    username: string, 
    valid: () => {} | any, 
    cancel: () => {} |any
}


export function ConfirmView(props: TConfirmView) {
    return (
        <div className="flex-column-center confirmview-container">
            <p>{`Are you sure to ${props.type} `}
                <span className="remove-friend-username">
                    {props.username}
                </span> ?
            </p>
            <ConfirmViewButtons
                valid={props.valid}
                cancel={props.cancel}
            />
        </div>
    )
}

type TConfirmViewMuteAction = {
    channel: Channel,
    user: User,
    setConfirmView: any,
    username: string, 
    cancel: any
}

export function ConfirmViewMuteAction(props: TConfirmViewMuteAction) {

    const { muteUser } = useMuteUser();

    const [seconds, setSeconds]: any = useState("")
    const [error, setError] = useState("");


    function submit() {
        let newSeconds: string = seconds && seconds.trim();
        if (newSeconds && /^\d+$/.test(newSeconds)) {
            if (newSeconds.length > 5)
                return (setError("Mute too long (seconds < 100 000)"));
            muteUser(props.user, props.channel, Number(newSeconds));
            props.setConfirmView(false);
        }
        else
            setError("Wrong number of seconds")
    }

    function onChange(e: any) {
        setError("");
    }

    return (
        <div className="flex-column confirmview-container red">
            <p>{`How many seconds do you want to mute `}
                <span className="remove-friend-username">
                    {props.username}
                </span> ?
            </p>
            {error && <p className="red-c reset">{error}</p>}
            <InfoInput
                id="mute"
                label="Number of seconds"
                value={seconds}
                setValue={setSeconds}
                submit={() => submit()}
                onChange={onChange}
            />
            <ResizeContainer width="60%" >
                <ConfirmViewButtons
                    valid={submit}
                    cancel={props.cancel}
                />
            </ResizeContainer>
        </div>
    )
}

type TConfirmViewTypeProteced = {
    channel: Channel,
    setConfirmView: any,
    cancel: any
}

export function ConfirmViewTypeProteced(props: TConfirmViewTypeProteced) {

    const [password, setPassword]: any = useState("")

    const [error, setError] = useState("");

    const { updateChannelType } = useChannels();

    function submit() {
        let newPassword: string = password && password.trim();
        if (newPassword) {
            if (newPassword.length > 15)
                return (setError("Password too long (15 letters max)"));
            updateChannelType(props.channel.id, "PROTECTED", newPassword)
            props.setConfirmView(false);
        }
    }

    function onChange(e: any) {
        setError("");
    }

    return (
        <div className="flex-column confirmview-container red">
            <h3>To protect a channel you need to set a password</h3>
            <InfoInput
                id="init-password"
                label="Set a password"
                value={password}
                setValue={setPassword}
                submit={() => submit()}
                onChange={onChange}
            />
            {error && <p className="red-c reset">{error}</p>}
            <ResizeContainer width="60%" >
                <ConfirmViewButtons
                    valid={submit}
                    cancel={props.cancel}
                />
            </ResizeContainer>
        </div>
    )
}


type TConfirmViewButtons = {
    valid: any,
    cancel: any 
    color1?: string, 
    backColor1?: string,
    color2?: string, 
    backColor2?: string,
}

export function ConfirmViewButtons(props: TConfirmViewButtons) {

    function validStyle()
    {
        let style = {};
        if (props.color1)
            style = {color: props.color1};
        if (props.backColor1)
            style = {...style, backgroundColor: props.backColor1}
        return (style);
    }

    function validCancel()
    {
        let style = {};
        if (props.color2)
            style = {color: props.color2};
        if (props.backColor2)
            style = {...style, backgroundColor: props.backColor2}
        return (style);
    }

    return (
        <div className="fill flex" style={{ justifyContent: 'space-around' }}>
            <button
                className="button red white-color confirmview-button"
                style={validStyle()}
                onClick={props.valid}
            >
                Valid
            </button>
            <button
                className="button white confirmview-button"
                style={validCancel()}
                onClick={props.cancel}
            >
                Cancel
            </button>
        </div>
    )
}

export function ConfirmPage({ children, ...props }: any) {
    return (
        <div 
            className="fill absolute confirm-background flex-center" 
            style={{ top: '0', left: '0' }}
            {...props}
        >
            {children}
        </div>
    )
}