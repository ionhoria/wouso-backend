const Sequelize = require('sequelize')
const { db } = require('../index')

const Fight = db.define('fights', {
  fightId: {
    type: Sequelize.INTEGER
  },
  challengerFinished: {
    type: Sequelize.BOOLEAN
  },
  challengedFinished: {
    type: Sequelize.BOOLEAN
  },
  stake: {
    type: Sequelize.INTEGER
  }
})

module.exports = Fight
