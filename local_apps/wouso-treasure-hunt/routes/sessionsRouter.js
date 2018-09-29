const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const { Session, Question } = require('../models/session_question')

const sessionsRouter = express.Router()

sessionsRouter.get('/', async (req, res) => {
  const sessionRecord = await Session.findAll({
    attributes: ['id', 'adminId', 'name']
  })
  res.json(sessionRecord)
})

sessionsRouter.post('/', async (req, res, next) => {
  const { name, questions } = req.body
  const { id: adminId } = req.session.user

  // Quiz must have exactly 10 questions
  if (questions.length !== 10) return next({ status: 400 })

  const session = await Session.create({
    adminId,
    name
  })
  // Waaaaay too many database queries :(
  questions.forEach(async ({ id, text }, index) => {
    await session.addChoiceQuestion(id, { through: { sortOrder: ++index } })
  })
  // await session.addThQuestions(questions)
  res.json({ id: session.id, adminId, name })
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
