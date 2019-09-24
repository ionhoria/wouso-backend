const Sequelize = require('sequelize')
const { db } = require('../index')

const ActiveSession = db.define('weeklyActiveSession', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  sessionId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  questionIndex: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

module.exports = ActiveSession
