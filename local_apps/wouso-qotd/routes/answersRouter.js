const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const Answer = require('../models/answer')
const { Session, Question } = require('../models/session_question')

const answersRouter = express.Router()

answersRouter.post('/', async (req, res, next) => {
  const { answer } = req.body
  const userId = req.session.user.id

  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 864e5).toISOString()

  let qotd = await Session.findOne({
    attributes: ['day'],
    include: { model: Question },
    where: {
      day: { [Sequelize.Op.lte]: now, [Sequelize.Op.gte]: yesterday }
    }
  })
  if (!qotd) {
    return next({ status: 404 })
  }

  await Answer.create({
    day: qotd.day,
    userId,
    grade: answer === qotd.choiceQuestion.answers.valid ? 10 : 0
  })
    .then(() => res.json({}))
    .catch(() => next({ status: 400 }))
})

module.exports = answersRouter
