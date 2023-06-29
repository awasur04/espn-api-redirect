const mysql = require('mysql');
const { database } = require('./config.json');

let connection = mysql.createConnection(
	{
		host: database.ip,
		user: database.username,
		password: database.password,
		database: database.database
	}
)

function testConnection()
{
	connection.connect(function (err)
	{
		if (err) throw err;
		console.log("Connected!");
	});
}

function getAllGames()
{
	let sqlQuery = "SELECT * FROM test_scores"
	connection.connect(function (err)
	{
		if (err) throw err;
		connection.query(sqlQuery, function (err, result, fields)
		{
			if (err) throw err;
			console.log(result);
		});
	});
}

function insertAllGames(gameList)
{
	let sqlQuery = "INSERT INTO test_scores (home_team_id, away_team_id, home_score, away_score, game_status, game_time, home_odds, away_odds) VALUES ?"
	connection.connect(function (err)
	{
		connection.query(sqlQuery, [gameList], function (err, result)
		{
			if (err) throw err;
			console.log("Added: " + result.affectedRows);
		});
	});
}

module.exports =
{
	insertAllGames
}

getAllGames();
