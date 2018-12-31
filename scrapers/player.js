const cheerio = require('cheerio')

// team url - 'http://www.espn.com/nfl/team/_/name/lar/los-angeles-rams'

const playerPageSelectors = {
	headshotImage: '.main-headshot > img', // grab src
	name: '.mod-container h1', // grab text content
	generalInfo: '.general-info > li' // get all lis
}

function getNumberAndPositionFromGeneralInfo(generalInfo) {
	const [numberWithHash, position] = generalInfo
		.filter('.first')
		.text()
		.split(' ')
	const number = Number(numberWithHash.replace('#', ''))

	return {
		number,
		position
	}
}

function scrapePlayerInfo(html) {
	const $ = cheerio.load(html)
	const imageElement = $(playerPageSelectors.headshotImage)

	const name = $(playerPageSelectors.name).text()
	const generalInfo = $(playerPageSelectors.generalInfo)

	const { number, position } = getNumberAndPositionFromGeneralInfo(generalInfo)

	return {
		imageUrl: imageElement.attr('src'),
		name,
		number,
		position
	}
}

module.exports.scrapePlayerInfo = scrapePlayerInfo

// const statType = {
// 	Passing: 'Passing',
// 	Rushing: 'Rushing',
// 	Fumbles: 'Fumbles',
// 	Receiving: 'Receiving',
// 	Defensive: 'Defensive'
// }

function getWeekMatchupInfo(statRow, context) {
	const tds = context(statRow).find('td')
	const date = context(tds.get(0)).text()
	const opponent = context('.team-name', tds).text()
	const gameResult = context('span', tds.get(2)).text()

	return {
		date: date.split(' ')[1],
		opponent,
		gameResult
	}
}

function getStatsForPasser(statRows, context) {
	const stats = statRows.map(row => {
		// const rushing = context()
		const matchupInfo = getWeekMatchupInfo(row, context)

		// passing
		const tds = context(row).find('td')
		const completions = Number(context(tds.get(3)).text())
		const passingAttempts = Number(context(tds.get(4)).text())
		const yards = Number(context(tds.get(5)).text())
		const completionPercentage = Number(context(tds.get(6)).text())
		const average = Number(context(tds.get(7)).text())
		const long = Number(context(tds.get(8)).text())
		const touchdowns = Number(context(tds.get(9)).text())
		const interceptions = Number(context(tds.get(10)).text())
		const qbr = Number(context(tds.get(11)).text())
		const rating = Number(context(tds.get(12)).text())

		// rushing
		const rushingAttempts = Number(context(tds.get(13)).text())
		const rushingYards = Number(context(tds.get(14)).text())
		const rushingAverage = Number(context(tds.get(15)).text())
		const rushingLong = Number(context(tds.get(16)).text())
		const rushingTouchdowns = Number(context(tds.get(17)).text())

		return {
			...matchupInfo,
			passing: {
				completions,
				attempts: passingAttempts,
				yards,
				completionPercentage,
				average,
				long,
				touchdowns,
				interceptions,
				qbr,
				rating
			},
			rushing: {
				attempts: rushingAttempts,
				yards: rushingYards,
				average: rushingAverage,
				long: rushingLong,
				touchdowns: rushingTouchdowns
			}
		}
	})

	return stats
}

function getStatsForRusher(statRows, context) {
	return {
		rushing: {},
		receiving: {},
		fumbles: {}
	}
}

function getStatsForReceiver(statRows, context) {
	return {
		rushing: {},
		receiving: {},
		fumbles: {}
	}
}

function getStatsForDefensivePlayer(statRows, context) {}

const positionToStatTypeMap = {
	QB: getStatsForPasser,
	RB: getStatsForRusher,
	FB: getStatsForRusher,
	WR: getStatsForReceiver,
	TE: getStatsForReceiver,
	DE: getStatsForDefensivePlayer,
	DT: getStatsForDefensivePlayer,
	LB: getStatsForDefensivePlayer,
	CB: getStatsForDefensivePlayer,
	S: getStatsForDefensivePlayer
	// DE: getStatsForDefensivePlayer,
}

const statSelectors = {
	statTable: '.mod-content table.tablehead'
}

function mapToStatTableRows(tableRows, context) {
	const rows = []
	// filter out stathead, colhead and total

	const filterOutRows = ['stathead', 'colhead', 'total']
	tableRows.each((_, row) => {
		if (filterOutRows.every(rowClass => !context(row).hasClass(rowClass))) {
			rows.push(row)
		}
	})

	return rows
}

function scrapeWeeklyStatsForPlayer(html) {
	const $ = cheerio.load(html)

	const generalInfo = $(playerPageSelectors.generalInfo)

	const { position } = getNumberAndPositionFromGeneralInfo(generalInfo)

	const statFactoryForPosition = positionToStatTypeMap[position]

	const tableRows = $(`${statSelectors.statTable} tr`)

	const statRows = mapToStatTableRows(tableRows, $)

	const stats = statFactoryForPosition(statRows, $)

	// get rows, iterate through, mapping to stat
	return stats
}

module.exports.scrapeWeeklyStatsForPlayer = scrapeWeeklyStatsForPlayer
