const Challenge = require('./challenge')
const Question = require('../../../shared/models/choiceQuestion')
const Answer = require('./answer')
const User = require('../../../users/models/user')

Challenge.belongsTo(User, { as: 'senderName', foreignKey: 'sender' })
Challenge.belongsTo(User, { as: 'receiverName', foreignKey: 'receiver' })
Challenge.belongsTo(Question, {
  foreignKey: { name: 'questionId', allowNull: false }
})

Answer.belongsTo(Challenge, { foreignKey: 'challengeId' })
Answer.belongsTo(User, { foreignKey: 'challengeId' })

// Sync database
Challenge.sync()
Answer.sync()

// Challenge.create({
//   sender: 1,
//   receiver: 75,
//   expires: new Date(Date.now() + 600000)
// })

module.exports = { Challenge, Question, Answer, User }
