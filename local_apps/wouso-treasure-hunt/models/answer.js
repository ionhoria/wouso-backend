const Sequelize = require('sequelize')
const { db } = require('../index')

const Answer = db.define('thAnswers', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  sessionId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  grade: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

Answer.sync()

module.exports = Answer
