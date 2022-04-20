const cheerio = require('cheerio');
const request = require('request');
const { Fighter, Event, Match, ufcFightList } = require('./data');

const ufcEventsRoot = "https://www.sherdog.com";
const ufcEventList = "/organizations/Ultimate-Fighting-Championship-UFC-2";

function updateEventList()
{
	ufcFightList = [];
	let requestReponse = loadSiteHTML(ufcEventsRoot + ufcEventList, function (error, html)
	{
		let $ = cheerio.load(html);
		let upcomingId = $("#upcoming_tab").find("*[itemprop = 'url']").each((i, element) => 
		{
			let eventSiteExtension = $(element).attr('href');
			let eventRequest = loadSiteHTML(ufcEventsRoot + eventSiteExtension, function (error, html)
			{
				updateEventDetails(html);
			})
		});
	});
}

function updateEventDetails(eventHTML)
{
	let $ = cheerio.load(eventHTML);

	ufcFightList.push(
		new Event(
			eventName: $(".event_detail").find("h1").text(),
			date: $(".event_detail").find("[itemprop=startDate]").text(),
			matches[0] =
			new Match(
				matchID: 0,
				fighter0: request(ufcEventsRoot + $(".fighter left_side").attr("href").find("[itemprop='url']"), getFighterDetails(error, html)),
				fighter1: request(ufcEventsRoot + $(".fighter right_side").attr("href").find("[itemprop='url']"), getFighterDetails(error, html)),
				weightClass: $(".weight_class").text()
			)
		)
	)
}

function getFighterDetails(error, html)
{

}

let loadSiteHTML = function (siteExtension, callback)
{
	let html = request(siteExtension, function (error, response, html)
	{
		if (error && response.statusCode != 200)
		{
			console.log("Failed to load HTML from " + site + "\nError: " + error);
		}
		callback(error, html);
	});
};

updateEventList(html);