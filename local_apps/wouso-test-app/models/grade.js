const Sequelize = require('sequelize')
const { db } = require('../index')

const Grade = db.define('grades', {
  adminId: {
    type: Sequelize.INTEGER
  },
  userId: {
    type: Sequelize.INTEGER
  },
  sessionId: {
    type: Sequelize.INTEGER
  },
  grade: {
    type: Sequelize.INTEGER
  }
})

Grade.sync()

module.exports = Grade
