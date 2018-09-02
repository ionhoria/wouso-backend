const Sequelize = require('sequelize')
const { db } = require('../index')

Session = db.define('sessions', {
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

Question = db.define('questions', {
  text: {
    type: Sequelize.STRING
  }
})

const SessionQuestion = db.define('sessionQuestion', {
  sessionId: {
    type: Sequelize.INTEGER
  },
  questionId: {
    type: Sequelize.INTEGER
  }
})

Session.belongsToMany(Question, { through: SessionQuestion })
Question.belongsToMany(Session, { through: SessionQuestion })

Session.sync()
Question.sync()
SessionQuestion.sync()

module.exports = { Session, Question }
