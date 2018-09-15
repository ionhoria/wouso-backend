const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const ActiveSession = require('../models/activeSession')
const { Session, Question } = require('../models/session_question')

const activeSessionsRouter = express.Router()

// Should be moved to some util file and imported
const shuffle = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

activeSessionsRouter.get('/gradebook', async (req, res, next) => {
  const gradebook = await ActiveSession.findAll({
    include: { model: Session },
    attributes: ['userId', 'question', 'grade']
  })

  res.json(gradebook)
})

activeSessionsRouter.get('/:id', async (req, res, next) => {
  const { id: sessionId } = req.params
  const { id: userId } = req.session.user

  const session = await Session.findById(sessionId)
  if (!session) return next({ status: 400 })

  let payload = { id: sessionId, name: session.name }

  const activeSession = await ActiveSession.findOrCreate({
    where: { sessionId, userId },
    attributes: ['sessionId', 'userId', 'question', 'createdAt'],
    defaults: { sessionId, userId }
  }).spread((activeSession, created) => activeSession)

  if (activeSession.createdAt < Date.now() - 100 * 1000) {
    return next({ status: 400 })
  }
  payload.createdAt = activeSession.createdAt

  const questions = await session.getThQuestions()
  payload['question'] = questions.find(question => {
    return question.thSessionQuestion.sortOrder === activeSession.question
  })

  if (!payload.question) next({ status: 404 })

  payload.question.answers = shuffle(
    payload.question.answers.invalid.concat(payload.question.answers.valid)
  )

  res.json(payload)
})

activeSessionsRouter.post('/', async (req, res, next) => {
  const { sessionId, answer } = req.body
  const userId = req.session.user.id

  if (!answer) return next({ status: 400 })

  const session = await Session.findById(sessionId, {
    include: { model: Question }
  })
  if (!session) return next({ status: 400 })

  const activeSession = await ActiveSession.findOne({
    where: { sessionId, userId }
  })
  if (!activeSession || activeSession.createdAt < Date.now() - 106 * 1000) {
    return next({ status: 400 })
  }

  const question = session.thQuestions.find(question => {
    return question.thSessionQuestion.sortOrder === activeSession.question
  })

  if (question.answers.valid === answer) {
    activeSession.update({
      question: ++activeSession.question,
      grade: ++activeSession.grade
    })
  } else {
    activeSession.update({
      question: ++activeSession.question
    })
  }

  res.json({})
})

module.exports = activeSessionsRouter
