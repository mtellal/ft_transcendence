import React, { useEffect, useState } from "react";
import s from './style.module.css'

interface BoxAchievementsProps {
	name: string;
	description: string;
	image: any;
}

export function BoxAchievements({ name, description, image }: BoxAchievementsProps) {
	return (
		<div className={s.container}>
			<div className={s.headerDiv}>
				{name}
			</div>
			<div className={s.content}>
				<p>{description}</p>
				<img className={s.image} src={image} alt="imgAchievements"/>
				<div className={s.bar}>
					<div className={s.progress}></div>
				</div>
			</div>
		</div>
	);
}
