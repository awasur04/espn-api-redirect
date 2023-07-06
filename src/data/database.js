const mysql = require('mysql');
const { database } = require('../config.json');

let pool = mysql.createPool(
	{
		connectionLimit: 10,
		host: database.ip,
		user: database.username,
		password: database.password,
		database: database.database
	}
)

module.exports.Database =
{
	testConnection: function()
	{
		pool.getConnection(function (err, connection)
		{
			if (err) 
			{
				connection.release();
				throw err;	
			}

			console.log("Connected!");
			connection.release();
		});
	},

	getAllGames: function()
	{
		let sqlQuery = "SELECT * FROM test_scores"
		pool.getConnection(function (err, connection)
		{
			if (err) 
			{
				connection.release();
				throw err;	
			}

			connection.query(sqlQuery, function (err, result, fields)
			{
				if (err) 
				{
					connection.release();
					throw err;	
				}

				console.log(result);
			});
			connection.release();
		});
	},

	insertAllGames: function(gameList)
	{
		let sqlQuery = "INSERT INTO active_scores (game_id, home_team_id, away_team_id, home_score, away_score, game_status, game_time, home_odds, away_odds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
		pool.getConnection(function (err, connection)
		{
			if (err) 
			{
				connection.release();
				throw err;	
			}
			for (game of gameList)
			{
				let sqlParams = [
					game.id,
					game.homeTeam.id,
					game.awayTeam.id,
					game.homeTeam.score,
					game.awayTeam.score,
					game.status,
					game.time,
					"0.0",
					"0.0"
				]

				connection.query(sqlQuery, sqlParams, function (err, result)
				{
					if (err) 
					{
						connection.release();
						throw err;	
					}
				});
			}
			connection.release();
		});
	},

	updateGames: function(gameList)
	{
		let sqlQuery = "UPDATE active_scores SET home_score=?, away_score=?, game_status=?, game_time=?, home_odds=?, away_odds=? WHERE game_id=?"
		pool.getConnection(function (err, connection)
		{
			if (err) 
			{
				connection.release();
				throw err;	
			}
			for (game of gameList)
			{
				let sqlParams = [
					game.homeTeam.score,
					game.awayTeam.score,
					game.status,
					game.time,
					"0.0",
					"0.0",
					game.id
				]

				connection.query(sqlQuery, sqlParams, function (err, result)
				{
					if (err) 
					{
						connection.release();
						throw err;	
					}
				});
			}
			connection.release();
		});
	},

	archiveGames: function()
	{
		let sqlQuery = "INSERT INTO archive_scores (SELECT * FROM active_scores)"
		let delQuery= "DELETE FROM active_scores"
		pool.getConnection(function (err, connection)
		{
			if (err) 
			{
				connection.release();
				throw err;	
			}

			connection.query(sqlQuery, function (err)
			{
				if (err) 
				{
					connection.release();
					throw err;	
				}
				
				connection.query(delQuery, function (err)
				{
					if (err) 
					{
						connection.release();
						throw err;	
					}
				});
				console.log("Archive Complete");
			});
			connection.release();
		});
	}
}