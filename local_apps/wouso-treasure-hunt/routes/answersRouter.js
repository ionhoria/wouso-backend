const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const Answer = require('../models/answer')
const { Session, Question } = require('../models/session_question')

const answersRouter = express.Router()

answersRouter.get('/:id', async (req, res) => {
  const { id } = req.params
  const answer = await Answer.findById(id, {
    attributes: ['id', 'userId', 'sessionId', 'questionId', 'text', 'grade']
  })
  res.json(answer)
})

answersRouter.post('/', async (req, res, next) => {
  const { sessionId } = req.body
  const userId = req.session.user.id

  const now = new Date().toISOString()
  const session = await Session.findOne({
    where: {
      id: sessionId,
      start: { [Sequelize.Op.lte]: now },
      end: { [Sequelize.Op.gte]: now }
    },
    include: [{ model: Question }]
  })

  if (!session) {
    return next({ status: 404 })
  }

  // Intoarce eroare daca cel putin un raspuns primit
  // nu corespunde niciunei intrebari din quiz
  if (
    req.body.answers.some(
      ({ questionId }) => !session.questions.some(({ id }) => questionId === id)
    )
  ) {
    return next({ status: 400 })
  }

  const bulkData = req.body.answers.map(({ questionId, text }) => ({
    sessionId,
    userId,
    questionId,
    text
  }))

  Answer.bulkCreate(bulkData, {
    updateOnDuplicate: ['text']
  })

  res.json({})
})

answersRouter.put('/grade', async (req, res) => {
  Answer.bulkCreate(req.body, {
    updateOnDuplicate: ['grade']
  })
  console.log(req.body)
  res.json({})
})

// answersRouter.put('/', async (req, res) => {
//   const { id, text } = req.body[0]
//   await Answer.update({ text }, { where: { id } })
//   res.json({})
// })

module.exports = answersRouter
