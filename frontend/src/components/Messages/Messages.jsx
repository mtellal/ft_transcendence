import s from './style.module.css'

export function Messages({ messages, id }) {

	// console.log('Component Messages');
	console.log('Component Messages', messages);
	// console.log('Component Messages 2', messages[0]);
	return (
		<div className={s.container}>
			{messages.map((message) => {
				// console.log('ii', message)
				// return (<div key>{messages.content}</div>);
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