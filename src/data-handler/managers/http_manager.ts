const axios = require('axios');
import { config } from "../config"

const { processGames } = require('./game_manager');

export function getScores()
{
	const options = {
		method: 'GET',
		url: config.SCORES_API,
	};

	axios
		.request(options)
		.then(function ({ data }: { data: any}) {
			processGames(data);
		})
		.catch(function (error: any) {
			console.error(error);
		});
}
