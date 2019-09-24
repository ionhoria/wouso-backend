const Sequelize = require('sequelize')
const { db } = require('../index')

const Answer = db.define('qotdAnswers', {
  userId: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  day: {
    type: Sequelize.DATE,
    primaryKey: true
  },
  answer: {
    type: Sequelize.STRING
  },
  valid: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = Answer
