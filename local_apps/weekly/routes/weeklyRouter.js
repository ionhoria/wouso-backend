const moment = require('moment')
const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const { Question, Session, ActiveSession, Activity } = require('../models')
const User = require('../../../users/models/user')
const requiresLogin = require('../../../utils/routes').requiresLogin
const { BASE, MULTIPLIER } = require('../config')

const weeklyRouter = express.Router()

weeklyRouter.get('/', requiresLogin, async (req, res, next) => {
  try {
    const userId = req.session.user.id

    const now = moment().toISOString()
    const session = await Session.findOne({
      where: {
        start: { [Sequelize.Op.lte]: now },
        end: { [Sequelize.Op.gte]: now }
      },
      attributes: ['id', 'name', 'start', 'end'],
      include: {
        model: Question,
        as: 'question',
        attributes: ['text', 'answer']
      }
    })
    if (!session) return next({ status: 404 })
    let index = null
    await ActiveSession.findOrCreate({
      where: { userId, sessionId: session.id }
    }).spread((active, created) => (index = active.questionIndex))
    if (index === null) throw 'Index should not be null.'
    const payload = session.toJSON()
    delete payload.id
    const question = session.question.find(
      q => q.weeklySessionQuestions.questionIndex === index
    )
    if (question) {
      payload.questionIndex = index
      payload.question = question.text
    } else {
      delete payload.question
      payload.completed = true
    }
    res.json(payload)
  } catch (err) {
    logger.error(err)
    next({ status: 500 })
  }
})

weeklyRouter.post('/', requiresLogin, async (req, res, next) => {
  try {
    const userId = req.session.user.id
    const { answer } = req.body

    if (answer.length === 0 || answer.length > 128) return next({ status: 400 })

    const now = moment().toISOString()
    const session = await Session.findOne({
      where: {
        start: { [Sequelize.Op.lte]: now },
        end: { [Sequelize.Op.gte]: now }
      },
      attributes: ['id', 'name', 'start', 'end'],
      include: {
        model: Question,
        as: 'question',
        attributes: ['id', 'text', 'answer']
      }
    })
    if (!session) return next({ status: 404 })
    const active = await ActiveSession.findOne({
      where: { userId, sessionId: session.id }
    })
    if (!active) return next({ status: 400 })
    const index = active.questionIndex
    const question = session.question.find(
      q => q.weeklySessionQuestions.questionIndex === index
    )
    if (!question || question.answer.toLowerCase() !== answer.toLowerCase()) { return next({ status: 400 }) }
    const scoreDelta = BASE + index * MULTIPLIER
    await Activity.create({
      text: `Answered weekly quest '${session.name}' (id: ${
        session.id
        }) question ${index} (id: ${question.id}).`,
      scoreDelta,
      userId
    })
    await User.update(
      { score: Sequelize.literal(`score + ${scoreDelta}`) },
      { where: { id: userId } }
    )
    await active.update({
      questionIndex: Sequelize.literal(`questionIndex + 1`)
    })
    res.json({})
  } catch (err) {
    logger.error(err)
    return next({ status: 500 })
  }
})

module.exports = weeklyRouter
