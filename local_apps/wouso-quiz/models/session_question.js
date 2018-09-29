const Sequelize = require('sequelize')
const { db } = require('../index')

Session = db.define('quizSessions', {
  adminId: {
    type: Sequelize.INTEGER
  },
  secret: {
    type: Sequelize.STRING
  },
  name: {
    type: Sequelize.STRING
  },
  start: {
    type: Sequelize.DATE
  },
  end: {
    type: Sequelize.DATE
  }
})

Question = db.define('openQuestions', {
  text: {
    type: Sequelize.STRING
  }
})

Session.belongsToMany(Question, { through: 'quizSessionQuestions' })
Question.belongsToMany(Session, { through: 'quizSessionQuestions' })

Session.sync()
Question.sync()

module.exports = { Session, Question }
