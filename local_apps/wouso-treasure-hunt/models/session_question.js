const Sequelize = require('sequelize')
const { db } = require('../index')

Session = db.define('thSessions', {
  adminId: {
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  }
})

Question = db.define('thQuestions', {
  text: {
    type: Sequelize.STRING
  },
  answers: {
    type: Sequelize.JSON
  }
})

const SessionQuestion = db.define('thSessionQuestion', {
  sortOrder: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  }
})

Session.belongsToMany(Question, { through: SessionQuestion })
Question.belongsToMany(Session, { through: SessionQuestion })

Session.sync()
Question.sync()
SessionQuestion.sync()

module.exports = { Session, Question }
