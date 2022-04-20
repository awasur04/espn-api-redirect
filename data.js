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

function Fighter(name, weight, height, age, record, odds)
{
	this.name = name;
	this.weight = weight;
	this.height = height;
	this.age = age;
	this.record = record;
	this.odds = odds;
}

function Match(matchID, fighter0, fighter1, weightClass)
{
	this.matchID = matchID;
	this.fighter0 = fighter0;
	this.fighter1 = fighter1;
	this.weightClass = weightClass;
}

function Event(eventName, date, ...matches)
{
	this.eventName = eventName;
	this.date = date;
	this.matchList = matches;
}

let nflGameList = [];
let ufcEventList = [];



/*
event1 =
{
	name = ""
	date = ""
	matches = 
	[
		eventID = 0
		fighter0 = 
		{
			name = "",
			weight = "",
			height = "",
			age = "",
			record = "",
			odds = ""
		},
		fighter1 = 
		{
			name = "",
			weight = "",
			record = "",
			odds = ""
		},
		weightClass = "",
	],
},
event2 = {}
...

*/

module.exports =
{
	//NFL EVENTS
	Team,
	Game,
	nflGameList,

	//UFC FIGHTS
	Fighter,
	Match,
	Event,
	ufcEventList
};
