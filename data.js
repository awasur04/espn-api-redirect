function Team(teamId, score)
{
	this.teamId = teamId;
	this.score = score;
}

function Game(matchId, homeTeam, awayTeam, gameTime, gameStatus)
{

	this.matchId = matchId;
	this.homeTeam = homeTeam;
	this.awayTeam = awayTeam;
	this.gameTime = gameTime;
	this.gameStatus = gameStatus;

}

let gameList = [];

module.exports =
{
	Team,
	Game,
	gameList
};
