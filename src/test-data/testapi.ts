//To enable test api start the api with node testapi.js
//Change the require module to http in index.js (https => http)
//Change the api link import in index.js as well (scores_api => test_scores_api)

import express, { Application, Request, Response } from 'express';
import scores from './scores.json';

const app: Application = express();
const PORT: number = 3000;

app.get('/scores', (req: Request, res: Response): void => {
    res.header("Content-Type", 'application/json');
	res.send(JSON.stringify(scores));
});

app.listen(PORT, (): void => {
	console.log(`Testing API listening on port ${PORT}!`);
});
