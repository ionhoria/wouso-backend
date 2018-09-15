const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const { Session, Question } = require('../models/session_question')
const ActiveSession = require('../models/activeSession')

const sessionsRouter = express.Router()

sessionsRouter.get('/', async (req, res) => {
  const userId = req.session.user.id
  const sessionRecord = await Session.findAll({
    attributes: ['id', 'adminId', 'name'],
    include: {
      model: ActiveSession,
      required: false,
      where: { userId },
      attributes: ['question', 'createdAt']
    }
  })
  res.json(sessionRecord)
})

sessionsRouter.post('/', async (req, res) => {
  const { name, questions } = req.body
  const { id: adminId } = req.session.user
  const session = await Session.create({
    adminId,
    name
  })
  // Waaaaay too many database queries :(
  questions.forEach(async ({ id, text }, index) => {
    await session.addThQuestion(id, { through: { sortOrder: ++index } })
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
