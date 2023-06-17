import React, { useEffect, useState } from "react";
import { BoxAchievements } from "../BoxAchievements/BoxAchievements";
import novice from "../../assets/novice.png"
import intermediate from "../../assets/intermediate.png"
import expert from "../../assets/expert.png"
import master from "../../assets/master.png"
import fire from "../../assets/fire.png"
import tenacious from "../../assets/tenacious.png"
import godlike from "../../assets/godlike.png"
import s from './style.module.css'

export function Achievements() {
	return (
		<div className={s.container}>
			<BoxAchievements name={'Novice'} description={"Play 1 Pong match"} image={novice}/>
			<BoxAchievements name={'Intermediate'} description={"Win 5 Pong matches"} image={intermediate}/>
			<BoxAchievements name={'Expert'} description={"Reach 10 Pong matches"} image={expert}/>
			<BoxAchievements name={'Master'} description={"Reach 20 Pong matches"} image={master}/>
			<BoxAchievements name={'On fire'} description={"Achieve 5 wins in a row"} image={fire}/>
			<BoxAchievements name={'Tenacisous'} description={"Experience 5 losses in a row"} image={tenacious}/>
			<BoxAchievements name={'Godlike'} description={"Have 80% win rate on 10 Pong matches"} image={godlike}/>
		</div>
	);
}