const Sequelize = require('sequelize')
const db = require('../../db')

const Tag = db.define(
  'tags',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
  },
  { timestamps: false }
)

module.exports = Tag
