import { Controller, Get } from '@nestjs/common';
import { GamesService } from './games.service';
import { ApiTags } from '@nestjs/swagger';

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
