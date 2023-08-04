import { updateGames } from "./managers/http_manager"

let minutesBetweenExecution = 60;
let convertedInterval = minutesBetweenExecution * 60 * 1000

setInterval(updateGames, convertedInterval);
