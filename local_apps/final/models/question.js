const Sequelize = require('sequelize')
const { db } = require('../index')

Question = db.define('finalQuestions', {
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  }
})

Question.sync()

module.exports = Question
