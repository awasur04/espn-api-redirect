const cheerio = require('cheerio');
const request = require('request')
const { Fighter, Event, Match } = require('./data');

const ufcEventsRoot = "https://www.sherdog.com";
const ufcEventListExtension = "/organizations/Ultimate-Fighting-Championship-UFC-2";

let ufcEventList = require('./data')

function updateEventList()
{
	ufcEventList = [];

	request(ufcEventsRoot + ufcEventListExtension, (err, res, html) =>
	{
		let $ = cheerio.load(html);

		let upcomingTab = $("#upcoming_tab").find("*[itemprop = 'url']").each((i, element) => 
		{
			console.log("yes");
			let eventSiteExtension = $(element).attr('href');
			updateEventDetails(ufcEventsRoot + eventSiteExtension, i);
		});

	});
}

function displayList()
{
	let sortedList = ufcEventList.sort((a, b) => a.date - b.date);
	console.log(sortedList);
}



function updateEventDetails(eventHTML, index)
{
	request(eventHTML, (err, res, html) =>
	{
		let $ = cheerio.load(html);

		ufcEventList[index] = new Event(
			//EVENT NAME
			$(".event_detail").find("h1").text(),

			//EVENT DATE
			new Date($(".event_detail .info > span:first").text()),

			//EVENT DATE STRING REPRESENTATION
			$(".event_detail .info > span:first").text(),

			//MAIN EVENT
			new Match(
				//MATCH ID
				0,
				null,
				null,
				//FIGHTER 0
				//getFighterDetails($(".fighter.left_side").find("[itemprop='url']").attr("href")),

				//FIGHTER 1
				//getFighterDetails($(".fighter.right_side").find("[itemprop='url']").attr("href")),

				//WEIGHT CLASS
				$(".weight_class:first").text()
			)
		)
	});

}

// async function getFighterDetails(fighterURLExtension)
// {
// 	if (fighterURLExtension)
// 	{
// 		let fighterPageHTML = await loadSiteHTML(ufcEventsRoot + fighterURLExtension);
// 		let $ = cheerio.load(fighterPageHTML);

// 		let currentFighter = new Fighter(
// 			//NAME
// 			$(".fighter-line1 h1 span.fn").text(),

// 			//WEIGHT
// 			$(".bio-holder").find("[itemprop='weight']").text(),

// 			//HEIGHT
// 			$(".bio-holder").find("[itemprop='height']").text(),

// 			//AGE
// 			$(".bio-holder table tbody tr td b:first").text(),

// 			//RECORD
// 			$(".winloses.win span:nth-child(2)").text() + "-" + $(".winloses.lose span:nth-child(2)").text(),

// 			//ODDS
// 			"0.0"
// 		)
// 		//console.log(currentFighter);
// 		return currentFighter;
// 	}

// 	return null;
// }

// async function loadSiteHTML(siteExtension)
// {
// 	let html = await fetch(siteExtension).then(function (response)
// 	{
// 		if (response.status != 200)
// 		{
// 			console.log("Failed to load HTML from " + site);
// 			return "";
// 		} else
// 		{
// 			return response.text();
// 		}
// 	});
// 	return html;
// };

updateEventList();