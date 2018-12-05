const Sequelize = require('sequelize')
const db = require('../../db')

Question = db.define('choiceQuestions', {
  text: {
    type: Sequelize.STRING
  },
  answers: {
    type: Sequelize.JSON
  }
})

Question.sync()

module.exports = Question
