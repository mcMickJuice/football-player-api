const { scrapeWeeklyStatsForPlayer } = require('../../scrapers/player')
const { getFixtureHtml } = require('../utility')

const fixture = getFixtureHtml('passing')
const result = scrapeWeeklyStatsForPlayer(fixture)

describe('passing', () => {
	it('contains number of rows in table', () => {
		expect(result.length).toBe(16)
	})

	describe('stat parsing', () => {
		const firstWeek = result.find(r => r.date === '9/9')

		it('non qb stats are undefined', () => {
			expect(firstWeek.receiving).toBeUndefined()
			expect(firstWeek.defensive).toBeUndefined()
			expect(firstWeek.fumbles).toBeUndefined()
		})

		it('parses week level information', () => {
			expect(firstWeek).toMatchObject({
				date: '9/9',
				opponent: 'CHI',
				gameResult: 'W'
			})
		})

		it('parses passing stats correctly', () => {
			expect(firstWeek.passing).toEqual({
				attempts: 30,
				completions: 20,
				yards: 286,
				average: 9.53,
				completionPercentage: 66.7,
				touchdowns: 3,
				long: 75,
				interceptions: 0,
				qbr: 43.7,
				rating: 130.7
			})
		})

		it('parses rushing stats correctly', () => {
			expect(firstWeek.rushing).toMatchObject({
				attempts: 1,
				yards: 15,
				average: 15.0,
				long: 15,
				touchdowns: 0
			})
		})
	})
})
