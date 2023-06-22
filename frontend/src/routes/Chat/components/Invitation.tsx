import React, { useContext, useState } from "react";
import { ConfirmPage, ConfirmViewButtons } from "../Profile/ChannelProfile/ConfirmAction";
import PickMenu from "../../../components/PickMenu";
import { ChatInterfaceContext } from "../Chat/Chat";
import { useInvitation } from "../../../hooks/Chat/useInvitation";

type TSetInvitation = {
    channelId: number
}

export function SetInvitation(props: TSetInvitation) {
    const [selected, setSelected] = useState("CLASSIC");
    const { setAction } = useContext(ChatInterfaceContext);
    const { sendInvitation } = useInvitation();


    return (
        <div className="white" style={{ padding: '5%', borderRadius: '5px', boxShadow: '0 1px 5px black' }} >
            <h2>Choose a game type</h2>
            <PickMenu
                collection={["CLASSIC", "SPEEDUP", "HARDMODE"]}
                selected={selected}
                setSelected={setSelected}
            />
            <div style={{paddingTop: '20px'}}>
                <ConfirmViewButtons
                    valid={() => { sendInvitation(props.channelId, selected) ;setAction(null)}}
                    cancel={() => setAction(null)}
                />
            </div>
        </div>
    )
}