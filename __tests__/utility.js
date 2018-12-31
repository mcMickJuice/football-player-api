const fs = require('fs')
const path = require('path')

function getFixtureHtml(fixtureName) {
	const html = fs.readFileSync(
		path.join(__dirname, 'fixtures', `${fixtureName}.html`),
		{
			encoding: 'utf8'
		}
	)

	return html
}

module.exports.getFixtureHtml = getFixtureHtml
