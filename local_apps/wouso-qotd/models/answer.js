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
  grade: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

Answer.sync()

module.exports = Answer
