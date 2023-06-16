import React, { useEffect, useState } from "react";
import { BoxAchievements } from "../BoxAchievements/BoxAchievements";
import trophy_1 from "../../assets/trophy1.png"
import trophy_5 from "../../assets/trophy5.png"
import s from './style.module.css'

export function Achievements() {
	return (
		<div className={s.container}>
			<BoxAchievements name={'Novice'} content={"Win 1 game"} image={trophy_1}/>
			<BoxAchievements name={'Intermediaire'} content={"Win 5 games"} image={trophy_5}/>
			<BoxAchievements name={'Intermediaire'} content={"Win 5 games"} image={trophy_5}/>
			<BoxAchievements name={'Intermediaire'} content={"Win 5 games"} image={trophy_5}/>
			<BoxAchievements name={'Intermediaire'} content={"Win 5 games"} image={trophy_5}/>
			<BoxAchievements name={'Intermediaire'} content={"Win 5 games"} image={trophy_5}/>
			<BoxAchievements name={'Intermediaire'} content={"Win 5 games"} image={trophy_5}/>
		</div>
	);
}