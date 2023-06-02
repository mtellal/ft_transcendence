import React from 'react';
import s from './style.module.css'

interface MessagesProps {
	messages: any;
	id: number;
}

export function Messages({ messages, id }: MessagesProps) {

	return (
		<div className={s.container}>
			{messages.map((message: any) => {
				return (
					<div
						className={s.boxMessage}
						key={message.id}
						style={{
							textAlign: message.sendBy === id ? 'right' : 'left',
						}}>
						{/* {message.content} */}
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