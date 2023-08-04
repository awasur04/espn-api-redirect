const mysql2 = require('mysql2/promise');
import { config } from "../config"

export type GameResult = {
	game_id: string;
    home_team_id: number;
    away_team_id: number;
    home_score: number;
    away_score: number;
    game_status: string;
    game_time: string;
    home_odds: number;
    away_odds: number;
    week_number: number;
};

let queries = {
	testConnection: "SELECT VERSION()",
	// SELECT QUERIES
	getAllGames: "SELECT * FROM scores",
	getCurrentWeek: "SELECT * FROM scores WHERE week_number=?",
	// INSERT QUERIES
	insertGame: "INSERT INTO scores (game_id, home_team_id, away_team_id, home_score, away_score, game_status, game_time, home_odds, away_odds, week_number) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE home_score=VALUES(home_score), away_score=VALUES(away_score), game_time=VALUES(game_time), game_status=VALUES(game_status), home_odds=VALUES(home_odds), away_odds=VALUES(away_odds)",
	// UPDATE QUERIES
	updateGame: "UPDATE scores SET home_score=?, away_score=?, game_status=?, game_time=?, home_odds=?, away_odds=?, week_number=? WHERE game_id=?",
}

let pool = mysql2.createPool(
	{
		connectionLimit: 5,
		host: config.HOST,
		user: config.USERNAME,
		password: config.PASSWORD,
		database: config.DATABASE
	}
);

async function execute<TQueryResult = any>(query: string, params: any[]): Promise<TQueryResult | undefined> {
	try {
		const [ rows ] = await pool.query(query, params)
		return rows;
	}
	catch(error: any) {
		console.log(`MYSQL(execute): ${query} : ${params.join(', ')} failed to execute with error: ${error.message}`);
		return undefined;
	}
}

execute("SELECT VERSION()", []).then(() => {
	console.log("Database: connection established!");
}).catch((error) => {
	console.log("Database: " + error.message);
});

export const mysql = {
	queries: queries,
	query: execute
};

