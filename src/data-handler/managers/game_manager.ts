const { Database } = require('../database/database.js');

//List to store current updated games
let nflGameList: Game[] = [];
let database = new Database();

//------------------------------------
// Game alteration functions
//------------------------------------

function addGame(game: Game)
{
	nflGameList.push(createGameObect(game));
}

function updateGame(index: number, game: Game)
{
	//Replace old game object with updated game
	nflGameList[index] = createGameObect(game);
}

function createGameObect(game: any): Game
{
	//Create new team variables to update game list
	const competiton = game.competitions[0];

	let homeTeam: Team = { id: competiton.competitors[0].id, score: competiton.competitors[0].score, odds: 0.0 };
	let awayTeam: Team = { id: competiton.competitors[1].id, score: competiton.competitors[1].score, odds: 0.0 };

	return { id: game.id, homeTeam, awayTeam, time: new Date( Date.parse(game.date) ), status: game.status.type.name };
}

export function processGames(httpDataRequest: any)
{
	console.log(httpDataRequest.week.number);
	database.archiveGames();
	for (let game of httpDataRequest.events)
	{
		let index = nflGameList.findIndex(x => x.id == game.id);

		if (index == -1)
		{
			addGame(game);
		}
		else
		{
			updateGame(index, game);
		}
	}
	database.insertAllGames(nflGameList)
}
