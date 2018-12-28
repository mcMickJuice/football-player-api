const { get } = require('axios')
const { scrapePlayerInfo } = require('./scrapers/player')

const buildPlayerGamelogUrl = id =>
	`http://www.espn.com/nfl/player/gamelog/_/id/${id}/aaron-rodgers`

async function getPlayerInfoById(playerId) {
	const url = buildPlayerGamelogUrl(playerId)

	const response = await get(url)

	const html = response.data

	const playerInfo = scrapePlayerInfo(html)

	return playerInfo
}

module.exports.getPlayerInfoById = getPlayerInfoById
