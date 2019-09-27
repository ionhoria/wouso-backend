const Fight = require('./fight')
const Challenge = require('./challenge')

Fight.sync()
Challenge.sync()

module.exports = { Fight, Challenge }
