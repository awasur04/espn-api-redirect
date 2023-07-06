const { Database } = require('../data/database.js');

//List to store current updated games
let nflGameList = [];

//------------------------------------
// Object creation functions
//------------------------------------
function Game(matchId, homeTeam, awayTeam, gameTime, gameStatus)
{

	this.id = matchId;
	this.homeTeam = homeTeam;
	this.awayTeam = awayTeam;
	this.time = gameTime;
	this.status = gameStatus;

}

function Team(teamId, score) 
{
	this.id = teamId;
	this.score = score;
}

//------------------------------------
// Game alteration functions
//------------------------------------

function addGame(game)
{
	nflGameList.push(createGameObect(game));
}

function updateGame(index, game)
{
	//Replace old game object with updated game
	nflGameList[index] = createGameObect(game);
}

function createGameObect(game)
{
	//Create new team variables to update game list
	const competiton = game.competitions[0];

	let homeTeam = new Team(competiton.competitors[0].id, competiton.competitors[0].score);
	let awayTeam = new Team(competiton.competitors[1].id, competiton.competitors[1].score);

	return new Game(game.id, homeTeam, awayTeam, new Date( Date.parse(game.date) ), game.status.type.name);
}

module.exports.processGames = function(body)
{
	//Database.archiveGames();
	for (let game of body.events)
	{
		let index = nflGameList.findIndex(x => x.matchId == game.id);

		if (index == -1)
		{
			addGame(game);
		}
		else
		{
			updateGame(index, game);
		}
	}
	Database.insertAllGames(nflGameList)
}