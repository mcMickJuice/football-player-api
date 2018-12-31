const { get } = require('axios')
const {
	scrapePlayerInfo,
	scrapeWeeklyStatsForPlayer
} = require('./scrapers/player')

const buildPlayerGamelogUrl = id =>
	`http://www.espn.com/nfl/player/gamelog/_/id/${id}/aaron-rodgers`

async function getPlayerInfoById(playerId) {
	const url = buildPlayerGamelogUrl(playerId)

	const response = await get(url)

	const html = response.data

	const playerInfo = scrapePlayerInfo(html)
	playerInfo.id = playerId

	return playerInfo
}
module.exports.getPlayerInfoById = getPlayerInfoById

async function getCurrentSeasonByPlayerId(playerId) {
	const url = buildPlayerGamelogUrl(playerId)

	const response = await get(url)

	const currentSeasonStats = scrapeWeeklyStatsForPlayer(response.data)

	return currentSeasonStats
}

module.exports.getCurrentSeasonByPlayerId = getCurrentSeasonByPlayerId
