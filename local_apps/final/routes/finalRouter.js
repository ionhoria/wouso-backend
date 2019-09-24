const { execSync } = require('child_process')
const moment = require('moment')
const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const { Question, Session, ActiveSession, Activity } = require('../models')
const User = require('../../../users/models/user')
const requiresLogin = require('../../../utils/routes').requiresLogin
const { ROOT_PATH, ANSWER_FORMAT, BASE, MULTIPLIER } = require('../config')

const finalRouter = express.Router()

finalRouter.get('/', requiresLogin, async (req, res, next) => {
  try {
    const userId = req.session.user.id

    const now = moment().toISOString()
    let session = null
    if (userId === -1) {
      session = await Session.findByPk(1, {
        attributes: ['id', 'name', 'guide', 'start', 'end'],
        include: {
          model: Question,
          as: 'question',
          attributes: ['text']
        }
      })
    } else {
      session = await Session.findOne({
        where: {
          start: { [Sequelize.Op.lte]: now },
          end: { [Sequelize.Op.gte]: now }
        },
        attributes: ['id', 'name', 'guide', 'start', 'end'],
        include: {
          model: Question,
          as: 'question',
          attributes: ['text']
        }
      })
    }
    if (!session) return next({ status: 404 })
    let index = null
    await ActiveSession.findOrCreate({
      where: { userId, sessionId: session.id }
    }).spread((active, created) => (index = active.questionIndex))
    if (index === null) throw 'Index should not be null.'
    const payload = session.toJSON()
    delete payload.id
    const question = session.question.find(
      q => q.finalSessionQuestions.questionIndex === index
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

const check = (taskId, username, answer) => {
  const cwd = ROOT_PATH + `0${taskId}`.slice(-2)
  const command = cwd + '/check' + ` ${username} '${answer}'`
  let valid = true
  try {
    execSync(command, { cwd })
  } catch (err) {
    valid = false
    logger.error(err)
    console.log(err)
  }
  return valid
}

finalRouter.post('/', requiresLogin, async (req, res, next) => {
  try {
    const userId = req.session.user.id
    const { answer } = req.body

    if (answer.length === 0 || !ANSWER_FORMAT.test(answer)) {
      return next({ status: 400 })
    }

    const now = moment().toISOString()
    let session = null
    if (userId === -1) {
      session = await Session.findByPk(1, {
        attributes: ['id', 'name', 'start', 'end'],
        include: {
          model: Question,
          as: 'question',
          attributes: ['text']
        }
      })
    } else {
      session = await Session.findOne({
        where: {
          start: { [Sequelize.Op.lte]: now },
          end: { [Sequelize.Op.gte]: now }
        },
        attributes: ['id', 'name', 'start', 'end'],
        include: {
          model: Question,
          as: 'question',
          attributes: ['text']
        }
      })
    }
    if (!session) return next({ status: 404 })
    const active = await ActiveSession.findOne({
      where: { userId, sessionId: session.id }
    })
    if (!active) return next({ status: 400 })
    const index = active.questionIndex
    const question = session.question.find(
      q => q.finalSessionQuestions.questionIndex === index
    )
    const valid = await check(index, req.session.user.username, answer)
    if (!valid) {
      return next({ status: 400 })
    }
    const scoreDelta = BASE + index * MULTIPLIER
    await Activity.create({
      text: `Answered final quest '${session.name}' (id: ${
        session.id
      }) question ${index} (id: ${question.id}): ${answer}.`,
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

module.exports = finalRouter
