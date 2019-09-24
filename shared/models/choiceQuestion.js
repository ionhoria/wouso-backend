const Sequelize = require('sequelize')
const db = require('../../db')
const Tag = require('./tag')

Question = db.define('choiceQuestions', {
  text: {
    type: Sequelize.STRING,
    allowNull: false
  },
  answers: {
    type: Sequelize.JSON,
    allowNull: false
  }
})

Question.belongsToMany(Tag, {
  through: 'choiceQuestionTags',
  constraints: false
})
Tag.belongsToMany(Question, {
  through: 'choiceQuestionTags',
  constraints: false
})

Question.sync()
Tag.sync()

module.exports = Question
