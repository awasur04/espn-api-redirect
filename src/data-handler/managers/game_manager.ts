import { mysql, MyCustomResult } from "../database/database";
//List to store current updated games
let nflGameList: Game[] = [];
let currentWeek = 0;

//------------------------------------
// Game alteration functions
//------------------------------------

function addGame(game: Game, weekNumber: number)
{
	let newGame = createGameObject(game, weekNumber)
	nflGameList.push(newGame);

	let gameInfo = [
		newGame.id,
		newGame.homeTeam.id,
		newGame.awayTeam.id,
		newGame.homeTeam.score,
		newGame.awayTeam.score,
		newGame.status,
		newGame.time,
		newGame.homeTeam.odds,
		newGame.awayTeam.odds,
		weekNumber
	]

	mysql.query(mysql.queries.insertGame, gameInfo);
}

function updateGame(index: number, game: Game, weekNumber: number)
{
	//Replace old game object with updated game
	let updatedGame = createGameObject(game, weekNumber);
	nflGameList[index] = updatedGame;

	let gameInfo = [
		updatedGame.id,
		updatedGame.homeTeam.id,
		updatedGame.awayTeam.id,
		updatedGame.homeTeam.score,
		updatedGame.awayTeam.score,
		updatedGame.status,
		updatedGame.time,
		updatedGame.homeTeam.odds,
		updatedGame.awayTeam.odds,
		weekNumber
	]

	mysql.query(mysql.queries.updateGame, gameInfo);
}

function createGameObject(game: any, weekNumber: number): Game
{
	//Create new team variables to update game list
	const competiton = game.competitions[0];
	let homeTeam: Team = { id: competiton.competitors[0].id, score: competiton.competitors[0].score, odds: 0.0 };
	let awayTeam: Team = { id: competiton.competitors[1].id, score: competiton.competitors[1].score, odds: 0.0 };
	return { id: game.id, homeTeam: homeTeam, awayTeam: awayTeam, time: new Date( Date.parse(game.date) ), status: game.status.type.name, week: weekNumber };
}

export function processGames(httpDataRequest: any)
{
	let weekNumber = httpDataRequest.week.number;
	if ( weekNumber > currentWeek ) { currentWeek = weekNumber; }

	for (let game of httpDataRequest.events)
	{
		let index = nflGameList.findIndex(x => x.id == game.id);

		if (index == -1)
		{
			addGame(game, weekNumber);
		}
		else
		{
			updateGame(index, game, weekNumber);
		}
	}

	let result = mysql.query<MyCustomResult>(mysql.queries.getCurrentWeek, [weekNumber]).then((games) =>
	{
		console.log(games?[0]);
	})
}
