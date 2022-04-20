const cheerio = require('cheerio');
const fetch = require('node-fetch')
const { Fighter, Event, Match } = require('./data');

const ufcEventsRoot = "https://www.sherdog.com";
const ufcEventListExtension = "/organizations/Ultimate-Fighting-Championship-UFC-2";

let ufcEventList = require('./data')

async function updateEventList()
{
	ufcEventList = [];
	let requestResponseHTML = await loadSiteHTML(ufcEventsRoot + ufcEventListExtension)
	let $ = cheerio.load(requestResponseHTML);
	let upcomingTab = $("#upcoming_tab").find("*[itemprop = 'url']").each(async (i, element) => 
	{
		let eventSiteExtension = $(element).attr('href');
		let eventRequestHTML = await loadSiteHTML(ufcEventsRoot + eventSiteExtension)
		updateEventDetails(eventRequestHTML);
	});
}

function updateEventDetails(eventHTML)
{
	let $ = cheerio.load(eventHTML);

	ufcEventList[0] = new Event(
		//EVENT NAME
		$(".event_detail").find("h1").text(),

		//EVENT DATE
		new Date($(".event_detail .info > span:first").text()),

		//MAIN EVENT
		new Match(
			//MATCH ID
			0,

			//FIGHTER 0
			getFighterDetails(ufcEventsRoot + $(".fighter left_side").attr("href")),

			//FIGHTER 1
			getFighterDetails(ufcEventsRoot + $(".fighter right_side").attr("href")),

			//WEIGHT CLASS
			$(".weight_class").text()
		)
	)
	let sortedList = ufcEventList.sort((a, b) => a.date - b.date);
	console.log(sortedList);
}

function getFighterDetails(fighterURLExtension)
{
	return { name: "Joe" }
}

async function loadSiteHTML(siteExtension)
{
	let html = await fetch(siteExtension).then(function (response)
	{
		if (response.status != 200)
		{
			console.log("Failed to load HTML from " + site);
			return "";
		} else
		{
			return response.text();
		}
	});
	return html;
};

updateEventList();