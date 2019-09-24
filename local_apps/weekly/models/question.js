const Sequelize = require('sequelize')
const { db } = require('../index')

Question = db.define('weeklyQuestions', {
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  answer: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

Question.sync()

module.exports = Question
