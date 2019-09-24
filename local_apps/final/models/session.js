const Sequelize = require('sequelize')
const { db } = require('../index')

Session = db.define('finalSessions', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  guide: {
    type: Sequelize.TEXT
  },
  start: {
    type: Sequelize.DATE,
    allowNull: false
  },
  end: {
    type: Sequelize.DATE,
    allowNull: false
  }
})

module.exports = Session
