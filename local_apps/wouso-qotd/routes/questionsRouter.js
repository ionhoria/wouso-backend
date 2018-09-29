const express = require('express')
const { Question } = require('../models/session_question')

const questionsRouter = express.Router()

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

// questionsRouter.delete('/:id', async (req, res) => {
//   await Question.destroy({
//     where: {
//       id: req.params.id
//     }
//   })
//   res.json({})
// })

module.exports = questionsRouter
