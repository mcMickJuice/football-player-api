const cheerio = require('cheerio')

//http://www.espn.com/nfl/player/gamelog/_/id/8439/aaron-rodgers
const buildPlayerGamelogUrl = id =>
	`http://www.espn.com/nfl/player/gamelog/_/id/${id}/aaron-rodgers`

// team url - 'http://www.espn.com/nfl/team/_/name/lar/los-angeles-rams'

const playerPageSelectors = {
	headshotImage: '.main-headshot > img', // grab src
	name: '.mod-container h1', // grab text content
	generalInfo: '.general-info > li' // get all lis
}

/**
 *
 * @param {String} id
 */
function scrapePlayerInfo(html) {
	const $ = cheerio.load(html)
	const imageElement = $(playerPageSelectors.headshotImage)

	const name = $(playerPageSelectors.name).text()
	const generalInfo = $(playerPageSelectors.generalInfo)

	const [numberWithHash, position] = generalInfo
		.filter('.first')
		.text()
		.split(' ')

	const number = Number(numberWithHash.replace('#', ''))

	return {
		imageUrl: imageElement.attr('src'),
		name,
		number,
		position
	}
}

module.exports.scrapePlayerInfo = scrapePlayerInfo
