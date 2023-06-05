import React from 'react';
import { GroupList } from '../GroupList/GroupList';
import s from './style.module.css';
export function Group({ myChannels, setidChannelSelected }) {
    // const selector = useSelector((store: RootState) => store.user.user);
    // const [socket, setSocket] = useState<Socket | null>(null);
    // Sert a rien ??
    // useEffect(() => {
    //     if (selector.token) {
    //         const newSocket = io('http://localhost:3000', {
    //             transports: ['websocket'],
    //             extraHeaders: {
    //                 'Authorization': `Bearer ${selector.token}`
    //             }
    //         })
    //         setSocket(newSocket);
    //     }
    // }, [setSocket, selector.token])
    return (React.createElement("div", null,
        React.createElement("div", { className: s.list }, myChannels.map((channel) => {
            // console.log('okiii', channel);
            if (channel.type !== 'WHISPER') {
                return (React.createElement("span", { key: channel.id },
                    React.createElement(GroupList, { channel: channel, setidChannelSelected: setidChannelSelected })));
            }
        }))));
}
