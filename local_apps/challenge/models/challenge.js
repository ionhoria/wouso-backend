const Sequelize = require('sequelize')
const { db } = require('../index')

const Challenge = db.define('challenges', {
  challenger: {
    type: Sequelize.INTEGER
  },
  challenged: {
    type: Sequelize.INTEGER
  },
  status: {
    type: Sequelize.STRING
  }
})

module.exports = Challenge
