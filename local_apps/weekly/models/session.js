const Sequelize = require('sequelize')
const { db } = require('../index')

Session = db.define('weeklySessions', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
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
