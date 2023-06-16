import React, { useEffect, useState } from "react";
import s from './style.module.css'

interface BoxAchievementsProps {
	name: string;
	content: string;
	image: any;
}

export function BoxAchievements({ name, content, image }: BoxAchievementsProps) {
	return (
		<div className={s.container}>
			<div className={s.headerDiv}>
				{name}
			</div>
			<div className={s.content}>
				<p>{content}</p>
				<img className={s.image} src={image} alt="imgAchievements"/>
				<div className={s.bar}>
					<div className={s.progress}></div>
				</div>
			</div>
		</div>
	);
}
