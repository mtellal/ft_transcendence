import { useState } from 'react';
import s from './style.module.css'

export function Chatbox({ send }) {

	const [value, setValue] = useState('');

	return (
		<div className={s.container} >
			{/* Yoooo */}
			<div className={s.messages}>Ok</div>
			<div className={s.inputBox}>
				<input className={s.input} onChange={(e) => setValue(e.target.value)} placeholder='Type your message...' value={value}></input>
				<button onClick={() => send(value)}>Send</button>
			</div>
		</div>
	);
}