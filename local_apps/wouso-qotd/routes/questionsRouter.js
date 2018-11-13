const shuffle = require('lodash/shuffle')
const express = require('express')
const { Question } = require('../models/session_question')

const questionsRouter = express.Router()

questionsRouter.get('/', async (req, res) => {
  const questions = await Question.findAll({
    attributes: ['id', 'text', 'answers']
  })
  res.json(questions)
})

questionsRouter.get('/:id', async (req, res) => {
  const question = await Question.findById(req.params.id, {
    attributes: ['text', 'answers']
  })
  question.answers = shuffle(
    question.answers.invalid.concat(question.answers.valid)
  )
  res.json(question)
})

questionsRouter.post('/', async (req, res) => {
  const { text, answers } = req.body
  const { id } = await Question.create({ text, answers })
  res.json({ id, text, answers })
})

module.exports = questionsRouter
