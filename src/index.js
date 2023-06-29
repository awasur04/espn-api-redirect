const https = require('http');
const { test_scores_api } = require('./config.json');
const { insertAllGames } = require('./database.js');

let nflGameList = [];

const request = https.request(test_scores_api, (response) => 
{
	let data = "";
	response.on('data', (chunk) =>
	{
		data = data + chunk.toString();
	});

	response.on('end', () =>
	{
		//Format our data response chunk into json format
		const body = JSON.parse(data);
		processGames(body);
		insertAllGames(nflGameList);
	});
});

request.on('error', (error) =>
{
	console.log(error);
})

request.end();

function processGames(body)
{
	for (let game of body.events) {
		let index = nflGameList.findIndex(x => x.game_id == game.id);

		if (index == -1) {
			addGame(game);
		}
		else {
			updateGame(index, game);
		}
	}
	console.log(nflGameList);
}

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

	return
	{
		game_id: game.id,
		home_team_id: competiton.competitors[0].id,
		away_team_id: competiton.competitors[1].id,
		home_score: competiton.competitors[0].score,
		away_score: competiton.competitors[1].score,
		game_status: game.status.type.name,
		game_time: game.date,
		home_odds: 1.0,
		away_odds: 2.0
	};
}