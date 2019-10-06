const Sequelize = require('sequelize')
const db = require('../../db')

Question = db.define('openQuestions', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  answer: {
    type: Sequelize.STRING,
    allowNull: false
  }
})

Question.sync()

module.exports = Question