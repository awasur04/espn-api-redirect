const https = require('http');
const { processGames } = require('./managers/game_manager');
const { test_scores_api } = require('./config.json');

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
	});
});

request.on('error', (error) =>
{
	console.log(error);
});

request.end();