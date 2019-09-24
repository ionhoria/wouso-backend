const Sequelize = require('sequelize')
const { db } = require('../index')
const Question = require('./question')
const Session = require('./session')
const ActiveSession = require('./activeSession')
const Activity = require('../../../shared/models/activity')

const SessionQuestions = db.define('weeklySessionQuestions', {
  questionIndex: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

Session.belongsToMany(Question, {
  as: 'question',
  through: SessionQuestions,
  constraints: false
})
ActiveSession.belongsTo(Session, {
  foreignKey: 'sessionId',
  constraints: false
})

Session.sync()
ActiveSession.sync()
SessionQuestions.sync()

module.exports = { Question, Session, ActiveSession, Activity }
