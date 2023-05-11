const https = require('https');
const { Team, Game, nflGameList } = require('./data');

const footballURL = 'https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard';

const request = https.request(footballURL, (response) => 
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
	});
});

request.on('error', (error) =>
{
	console.log(error);
})

request.end();

function processGames(body)
{
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
	console.log(nflGameList);
}

function addGame(game)
{
	gameList.push(createGameObect(game));
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

	return new Game(game.id, homeTeam, awayTeam, game.date, game.status.type.name);
}