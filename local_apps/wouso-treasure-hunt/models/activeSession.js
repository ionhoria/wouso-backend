const Sequelize = require('sequelize')
const { db } = require('../index')

const { Session } = require('./session_question')

const ActiveSession = db.define('thActiveSession', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  sessionId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  question: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  grade: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

ActiveSession.belongsTo(Session, {
  foreignKey: 'sessionId'
})
Session.hasMany(ActiveSession, { foreignKey: 'sessionId' })

ActiveSession.sync()
Session.sync()

module.exports = ActiveSession
