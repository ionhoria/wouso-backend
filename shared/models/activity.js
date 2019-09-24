const Sequelize = require('sequelize')
const db = require('../../db')
const User = require('../../users/models/user')

const Activity = db.define('logs', {
  text: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  scoreDelta: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  },
  eloDelta: {
    type: Sequelize.INTEGER,
    defaultValue: 0
  }
})

Activity.belongsTo(User, { constraints: false })

Activity.sync()

module.exports = Activity
