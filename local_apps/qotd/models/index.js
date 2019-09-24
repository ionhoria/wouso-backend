const Session = require('./session')
const Question = require('../../../shared/models/choiceQuestion')
const Answer = require('./answer')
const Tag = require('../../../shared/models/tag')
const Activity = require('../../../shared/models/activity')

Session.belongsTo(Question, {
  as: 'question',
  foreignKey: { allowNull: false, constraints: false }
})
Question.hasMany(Session, {
  as: 'session',
  foreignKey: { name: 'questionId', allowNull: false, constraints: false }
})

Session.hasMany(Answer, {
  as: 'answer',
  foreignKey: 'day',
  sourceKey: 'day',
  constraints: false
})
// Answer.belongsTo(Session, {
//   as: 'session',
//   foreignKey: 'day',
//   targetKey: 'day',
//   constraints: false
// })

Session.sync()
Answer.sync()

module.exports = { Session, Question, Answer, Tag, Activity }
