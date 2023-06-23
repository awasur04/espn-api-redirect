//To enable test api start the api with node testapi.js
//Change the require module to http in index.js (https => http)
//Change the api link import in index.js as well (scores_api => test_scores_api)

const express = require('express');
const scores = require('./scores.json');

const app = express();
const port = 3000;



app.get('/scores', (req, res) =>
{
	res.header("Content-Type", 'application/json');
	res.send(JSON.stringify(scores));
});

app.listen(port, () => console.log(`Testing API listening on port ${port}!`));