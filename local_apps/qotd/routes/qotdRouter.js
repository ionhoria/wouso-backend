const shuffle = require('lodash/shuffle')
const moment = require('moment')
const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const { Session, Question, Answer, Tag, Activity } = require('../models')
const User = require('../../../users/models/user')
const requiresLogin = require('../../../utils/routes').requiresLogin
const { ACTIVE, SCORE, DOUBLE_TIME } = require('../config')

const qotdRouter = express.Router()

qotdRouter.get('/', requiresLogin, async (req, res, next) => {
  const userId = req.session.user.id
  try {
    const today = moment(0, 'HH').toISOString()
    let qotd = await Session.findByPk(today, {
      attributes: ['day'],
      include: [
        {
          model: Question,
          as: 'question',
          attributes: ['text', 'answers']
        }
      ]
    })
    // Random qotd generation
    if (!qotd && ACTIVE) {
      logger.info('qotd not found. Generating random qotd.')
      /*
       * If no qotd is set, choose random question and generate qotd.
       * This randomly selects a question from the entire question pool. In the
       * future, we might want to consider tags when selecting.
       */
      const random = await Question.findAll({
        /*
         * Find all questions which do not already belong to a qotd session
         * (have not been used in the past)
         */
        where: { '$session.questionId$': null },
        include: {
          model: Session,
          as: 'session'
        },
        attributes: ['id']
      })
      if (random.length === 0) {
        logger.error(
          'Failed generating qotd! There are no suitable questions to choose from.'
        )
        return next({ status: 500 })
      }
      const question = random[Math.floor(Math.random() * random.length)]
      await Session.create({ day: today, questionId: question.id })
      qotd = await Session.findByPk(today, {
        attributes: ['day'],
        include: {
          model: Question,
          as: 'question',
          attributes: ['text', 'answers']
        }
      })
    }
    // QoTD might still be null (i.e ACTIVE config flag set to false)
    if (!qotd) return next({ status: 404 })
    const payload = qotd.toJSON()
    const { valid, invalid } = qotd.question.answers
    payload.question.answers = shuffle(invalid.concat(valid)) // shuffle answers
    const answer = await qotd.getAnswer({
      where: { userId },
      attributes: ['answer', 'valid']
    })
    if (answer.length > 0) payload.answer = answer[0].toJSON()
    res.json(payload)
  } catch (error) {
    logger.error(error)
    next({ status: 500 })
  }
})

qotdRouter.post('/', requiresLogin, async (req, res, next) => {
  const userId = req.session.user.id
  const { day, answer } = req.body
  const today = moment(0, 'HH').toISOString()
  if (!answer || day !== today) {
    return next({ status: 400 })
  }
  try {
    const qotd = await Session.findByPk(today, {
      attributes: ['day'],
      include: {
        model: Question,
        as: 'question',
        attributes: ['id', 'text', 'answers']
      }
    })
    if (!qotd) {
      throw "No qotd found! This is weird... Someone posted an answer for\
      today's qotd without ever fetching (or knowing) today's qotd"
    }
    const valid = answer === qotd.question.answers.valid
    await Answer.create({ userId, day, answer, valid })
    let scoreDelta = valid ? SCORE : 0
    if (moment.duration(moment().diff(moment(day))).asHours() < DOUBLE_TIME) {
      scoreDelta *= 2
    }
    await Activity.create({
      text: `${valid ? 'Valid' : 'Invalid'} answer for qotd on ${day}`,
      scoreDelta,
      userId
    })
    if (scoreDelta != 0) {
      await User.update(
        { score: Sequelize.literal(`score + ${scoreDelta}`) },
        { where: { id: userId } }
      )
    }
    res.json({ day, answer, valid })
  } catch (error) {
    // User has already answered qotd
    if (error.name === 'SequelizeUniqueConstraintError') {
      return next({ status: 400 })
    }
    logger.error(error)
    next({ status: 500 })
  }
})

module.exports = qotdRouter
