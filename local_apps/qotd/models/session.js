const Sequelize = require('sequelize')
const { db } = require('../index')

Session = db.define('qotdSessions', {
  day: {
    type: Sequelize.DATE,
    primaryKey: true
  }
})

module.exports = Session
