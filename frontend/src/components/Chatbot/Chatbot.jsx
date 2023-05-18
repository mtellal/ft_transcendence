import s from './style.module.css'

export function Chatbox() {
	return (
		<div className={s.container} >
			{/* Yoooo */}
			<div className={s.messages}>Ok</div>
			<div className={s.inputBox}>
				<input className={s.input}></input>
			</div>
		</div>
	);
}