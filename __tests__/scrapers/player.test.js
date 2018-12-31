const { getFixtureHtml } = require('../utility')
const { scrapePlayerInfo } = require('../../scrapers/player')

const sampleHtml = getFixtureHtml('player')

describe('player scraper', () => {
	it('gets name, imageUrl', () => {
		const playerInfo = scrapePlayerInfo(sampleHtml)

		expect(playerInfo).toEqual({
			name: 'Todd Gurley II',
			imageUrl:
				'http://a.espncdn.com/combiner/i?img=/i/headshots/nfl/players/full/2977644.png&w=350&h=254',
			number: 30,
			position: 'RB'
		})
	})
})
