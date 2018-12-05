const Sequelize = require('sequelize')
const { db } = require('../index')

const Challenge = db.define('challenges', {
  sender: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  receiver: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  expires: {
    type: Sequelize.DATE,
    allowNull: false
  },
  status: {
    type: Sequelize.ENUM,
    values: ['accepted', 'declined', 'pending'],
    defaultValue: 'pending',
    allowNull: false
  },
  victory: {
    type: Sequelize.BOOLEAN
  }
})

module.exports = Challenge
