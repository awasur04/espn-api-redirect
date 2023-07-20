const axios = require('axios');
import { config } from "./config"

//const { processGames } = require('./managers/game_manager');

function getScores()
{
	const options = {
		method: 'GET',
		url: config.SCORES_API,
	};

	axios
		.request(options)
		.then(function ({ data }: { data: any}) {
			console.log(data);
		})
		.catch(function (error: any) {
			console.error(error);
		});
}

getScores();
