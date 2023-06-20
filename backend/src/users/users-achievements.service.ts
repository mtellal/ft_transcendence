import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Stats } from "@prisma/client";
import { Server, Socket } from "socket.io";

@Injectable()
export class UsersAchievementsService {

	private predefinedAchievements = [
		{
		  name: "Novice",
		  description: "Play 1 Pong match",
		  condition: (stats: Stats) => stats.matchesPlayed >= 1,
		},
		{
		  name: "Intermediate",
		  description: "Win 5 Pong matches",
		  condition: (stats: Stats) => stats.matchesWon >= 5,
		},
		{
		  name: "Expert",
		  description: "Reach 10 Pong matches",
		  condition: (stats: Stats) => stats.matchesPlayed >= 10,
		},
		{
		  name: "Master",
		  description: "Reach 20 Pong matches",
		  condition: (stats: Stats) => stats.matchesPlayed >= 20,
		},
		{
		  name: "OnFire",
		  description: "Achieve 5 wins in a row",
		  condition: (stats: Stats) => stats.winStreak >= 5,
		},
		{
		  name: "Tenacious",
		  description: "Experience 5 losses in a row",
		  condition: (stats: Stats) => stats.lossStreak >= 5,
		},
		{
		  name: "Godlike",
		  description: "Have 80% win rate on more than 10 Pong matches",
		  condition: (stats: Stats) => (stats.matchesWon / stats.matchesPlayed) >= 0.8 && stats.matchesPlayed >= 10,
		},
	];

	constructor(private prisma: PrismaService) {}

	async showAchievements(userId: number) {
		return await this.prisma.achievements.findMany({
			where: {
				userId: userId
			},
		});
	}

	async checkAndUnlockAchievements(userId: number, server: Server, clientMap:  Map<number, string>) {
		const userStats = await this.prisma.stats.findUnique({
			where: { userId },
		});
		if (!userStats)
			throw new Error(`Stats not found for user with ID ${userId}`);
		for (const achievement of this.predefinedAchievements) {
			if (achievement.condition(userStats) && !await this.isAchievementUnlocked(userId, achievement.name)) {
				let updated = await this.unlockAchievement(userId, achievement);
				if (updated)
					if (clientMap.has(userId))
						server.to(clientMap.get(userId)).emit('Achievement', {
							Unlocked: {
								name: achievement.name,
								description: achievement.description
							},
							updated,
						});
			};
		}
	}

	private async isAchievementUnlocked(userId: number, achievementName: string) {
		return await this.prisma.achievements.findFirst({
			where : {
				userId: userId,
				[achievementName]: true,
			}
		});
	}


	private async unlockAchievement(userId: number, achievement: any) {
		const updated = await this.prisma.achievements.update({
			where: {
				userId: userId,
			},
			data: {
				[achievement.name]: true,
			},
		});
		return updated;
	}
}