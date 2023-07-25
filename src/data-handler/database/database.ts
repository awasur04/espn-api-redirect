const mysql = require('mysql2');
import { config } from "../config"

export class Database
{
	private dbPool: any;

	public constructor() {
		this.dbPool = mysql.createPool(
			{
				connectionLimit: 5,
				host: config.HOST,
				user: config.USERNAME,
				password: config.PASSWORD,
				database: config.DATABASE
			}
		);
	}

	public testConnection() {
		this.dbPool.getConnection(function (err: any, connection: any)
		{
			if (err)
			{
				connection.release();
				throw err;
			}

			console.log("Connected!");
			connection.release();
		});
	}

	public getAllGames() {
		let sqlQuery = "SELECT * FROM test_scores"
		this.dbPool.getConnection(function (err: any, connection: any)
		{
			if (err)
			{
				connection.release();
				throw err;
			}

			connection.query(sqlQuery, function (err: any, result: any)
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
	}

	public insertAllGames(gameList: Game[]) {
		let sqlQuery = "INSERT INTO active_scores (game_id, home_team_id, away_team_id, home_score, away_score, game_status, game_time, home_odds, away_odds) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
		this.dbPool.getConnection(function (err: any, connection: any)
		{
			if (err)
			{
				connection.release();
				throw err;
			}

			for (let game of gameList)
			{
				let sqlParams = [
					game.id,
					game.homeTeam.id,
					game.awayTeam.id,
					game.homeTeam.score,
					game.awayTeam.score,
					game.status,
					game.time,
					game.homeTeam.odds,
					game.awayTeam.odds
				];

				connection.query(sqlQuery, sqlParams, function (err: any, result: any)
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
	}

	public updateGames(gameList: Game[]) {
		let sqlQuery = "UPDATE active_scores SET home_score=?, away_score=?, game_status=?, game_time=?, home_odds=?, away_odds=? WHERE game_id=?"
		this.dbPool.getConnection(function (err: any, connection: any)
		{
			if (err)
			{
				connection.release();
				throw err;
			}
			for (let game of gameList)
			{
				let sqlParams = [
					game.homeTeam.score,
					game.awayTeam.score,
					game.status,
					game.time,
					game.homeTeam.odds,
					game.awayTeam.odds,
					game.id
				]

				connection.query(sqlQuery, sqlParams, function (err: any, result: any)
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
	}

	public archiveGames() {
		let sqlQuery = "INSERT INTO archive_scores (SELECT * FROM active_scores)"
		let delQuery= "DELETE FROM active_scores"
		this.dbPool.getConnection(function (err: any, connection: any)
		{
			if (err)
			{
				connection.release();
				throw err;
			}

			connection.query(sqlQuery, function (err: any)
			{
				if (err)
				{
					connection.release();
					throw err;
				}

				connection.query(delQuery, function (err: any)
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
