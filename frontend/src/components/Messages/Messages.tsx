import React, { useEffect, useRef } from 'react';
import s from './style.module.css'

interface MessagesProps {
	messages: any;
	id: number;
}

export function Messages({ messages, id }: MessagesProps) {

	const messagesContainerRef = useRef(null);

	useEffect(() => {
		const messageContainer = messagesContainerRef.current;
		if (messageContainer) {
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}
	}, [messages])

	return (
		<div className={s.container} ref={messagesContainerRef}>
			{messages.map((message: any) => {
				return (
					<div
						className={s.boxMessage}
						key={message.id}
						style={{
							textAlign: message.sendBy === id ? 'right' : 'left',
						}}>
						<span className={s.message}
							style={{
								backgroundColor: message.sendBy === id ? 'grey' : 'white'
							}}
						>
							{message.content}
						</span>
					</div>
				);
			})}
		</div>
	);
}