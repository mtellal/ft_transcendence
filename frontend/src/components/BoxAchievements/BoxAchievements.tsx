import React, { useEffect, useState } from "react";
import check from "../../assets/check.png"
import cross from "../../assets/cross.png"
import s from './style.module.css'

interface BoxAchievementsProps {
	name: string;
	description: string;
	image: any;
	condition: boolean;
}

export function BoxAchievements({ name, description, image, condition }: BoxAchievementsProps) {
	return (
		<div className={s.container}>
			<div className={s.headerDiv}>
				{name}
			</div>
			<div className={s.content}>
				<p>{description}</p>
				<img
					className={s.image}
					src={image}
					alt="imgAchievements"
					style={{
						opacity: condition ? '1' : '0.2'
					}}
				/>
				{condition && <img className={s.image} src={check}/>}
				{!condition && <img className={s.cross} src={cross}/>}
			</div>
		</div>
	);
}
