const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const { Session } = require('../models/session_question')
const Answer = require('../models/answer')

const sessionsRouter = express.Router()

// ToDo: Query by adminId
sessionsRouter.get('/', async (req, res) => {
  const sessionRecord = await Session.findAll({
    // ToDo where: { adminId },
    attributes: ['id', 'adminId', 'secret', 'name', 'start', 'end']
  })
  res.json(sessionRecord)
})

sessionsRouter.get('/join/:secret', async (req, res, next) => {
  const { secret } = req.params

  const now = new Date().toISOString()
  const session = await Session.findOne({
    where: {
      secret,
      start: { [Sequelize.Op.lte]: now },
      end: { [Sequelize.Op.gte]: now }
    },
    attributes: ['id', 'adminId', 'secret', 'name', 'start', 'end']
  })

  if (!session) {
    return next({
      status: 404
    })
  }

  const response = session.toJSON()
  const { id: sessionId } = response
  const { id: userId } = req.session.user

  response.questions = await session.getQuestions({
    attributes: ['id', 'text']
  })

  response.answers = await Answer.findAll({
    where: { sessionId, userId },
    attributes: ['userId', 'sessionId', 'questionId', 'text']
  })

  res.json(response)
})

// Require admin permissions
sessionsRouter.get('/:secret', async (req, res, next) => {
  const { secret } = req.params

  const session = await Session.findOne({
    where: { secret },
    attributes: ['id', 'name', 'adminId', 'secret', 'start', 'end']
  })

  if (!session) {
    return next({
      status: 404
    })
  }

  const response = session.toJSON()

  response['questions'] = await session.getQuestions({
    attributes: ['id', 'text']
  })
  response['answers'] = await Answer.findAll({
    where: { sessionId: session.id },
    attributes: ['userId', 'sessionId', 'questionId', 'text', 'grade']
  })

  res.json(response)
})

sessionsRouter.post('/', async (req, res) => {
  const adminId = req.session.user.id
  const {questions, ...quiz} = req.body
  const session = await Session.create({...quiz, adminId})
  await session.addQuestions(questions)
  res.json({})
})

sessionsRouter.delete('/:id', async (req, res) => {
  await Session.destroy({
    where: {
      id: req.params.id
    }
  })
  res.json({})
})

module.exports = sessionsRouter
