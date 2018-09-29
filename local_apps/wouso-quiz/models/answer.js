const Sequelize = require('sequelize')
const { db } = require('../index')

const Answer = db.define('quizAnswers', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  sessionId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  questionId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  text: {
    type: Sequelize.STRING
  },
  grade: {
    type: Sequelize.INTEGER,
    defaultValue: null
  }
})

Answer.sync()

module.exports = Answer
