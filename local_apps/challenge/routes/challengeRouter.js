const shuffle = require('lodash/shuffle')
const moment = require('moment')
const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
// const { Session, Question, Answer, Tag, Activity } = require('../models')
const User = require('../../../users/models/user')
const requiresLogin = require('../../../utils/routes').requiresLogin
const { QUERY_FORMAT } = require('../config')

const challengeRouter = express.Router()

challengeRouter.get('/', async (req, res, next) => {
  res.json({ message: 'hello' })
})

challengeRouter.get('/users', requiresLogin, async (req, res, next) => {
  const query = req.query.name
  console.log(query)
  if (!query || query.length < 3 || !QUERY_FORMAT.test(query)) {
    return next({ status: 400 })
  }
  const users = await User.findAll({
    attributes: ['firstName', 'lastName', 'username'],
    where: {
      [Sequelize.Op.and]: [
        { id: { [Sequelize.Op.ne]: req.session.user.id } },
        { username: { [Sequelize.Op.like]: `%${query}%` } }
      ]
    }
  })
  res.json(users)
})

module.exports = challengeRouter
