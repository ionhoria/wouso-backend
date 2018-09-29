const express = require('express')
const { Question } = require('../models/session_question')

const questionsRouter = express.Router()

questionsRouter.get('/', async (req, res) => {
  const questions = await Question.findAll({ attributes: ['id', 'text'] })
  res.json(questions)
})

questionsRouter.get('/:id', async (req, res) => {
  const question = await Question.findById(req.params.id, {
    attributes: ['id', 'text']
  })
  res.json(question)
})

questionsRouter.post('/', async (req, res) => {
  const { text } = req.body
  const { id } = await Question.create({ text })
  res.json({ id, text })
})

questionsRouter.delete('/:id', async (req, res) => {
  await Question.destroy({
    where: {
      id: req.params.id
    }
  })
  res.json({})
})

module.exports = questionsRouter
