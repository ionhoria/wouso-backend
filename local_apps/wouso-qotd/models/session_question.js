const Sequelize = require('sequelize')
const { db } = require('../index')

Session = db.define('qotdSessions', {
  day: {
    type: Sequelize.DATE,
    primaryKey: true
  }
})

Question = db.define('choiceQuestions', {
  text: {
    type: Sequelize.STRING
  },
  answers: {
    type: Sequelize.JSON
  }
})

Session.belongsTo(Question)

Session.sync()
Question.sync()

module.exports = { Session, Question }
