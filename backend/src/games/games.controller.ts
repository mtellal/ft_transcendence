import { Controller, Get, UseGuards } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtGuard } from 'src/auth/guard';

@UseGuards(JwtGuard)
@ApiBearerAuth()
@ApiTags('games')
@Controller('games')
export class GamesController {
	constructor(private gamesService: GamesService) {}

	@Get('all')
	async allGames() {
		return this.gamesService.allGames();
	}

	@Get('delete')
	async delAllGames() {
		this.gamesService.deleteAllGames();
		console.log('Deleting all Games');
	}
}
