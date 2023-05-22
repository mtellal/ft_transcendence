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
						className={s.message}
						key={message.id}
						style={{
							// textAlign: message.sendBy === id ? 'right' : 'left',
							backgroundColor: message.sendBy === id ? 'blue' : 'white'
						}}>
						{message.content}
					</div>
				);
			})}
		</div>
	);
}