const Fight = require('./fight')
const Challenge = require('./challenge')
const Question = require('../../../shared/models/choiceQuestion')

Fight.hasMany(Question, {
    as: 'questions',
    foreignKey: 'fightId',
    sourceKey: 'fightId',
    constraints: true
})
Question.belongsTo(Fight,{
    as: 'fight',
  foreignKey: { allowNull: false }
})

Fight.sync()
Challenge.sync()

module.exports = { Fight, Challenge, Question }
