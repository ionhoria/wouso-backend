const Sequelize = require('sequelize')
const { db } = require('../index')

const Answer = db.define('challengeAnswers', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  challengeId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true
  },
  correct: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = Answer
