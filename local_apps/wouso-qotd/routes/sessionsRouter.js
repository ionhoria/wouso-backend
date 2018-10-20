const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const Answer = require('../models/answer')
const { Session, Question } = require('../models/session_question')
const { db } = require('../index')

const sessionsRouter = express.Router()

const shuffle = array => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1))
    var temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
  return array
}

sessionsRouter.get('/', async (req, res, next) => {
  const userId = req.session.user.id
  let payload = {};
  const now = new Date().toISOString()
  const yesterday = new Date(Date.now() - 864e5).toISOString()
  let qotd = await Session.findOne({
    attributes: ['day'],
    include: { model: Question },
    where: {
      day: { [Sequelize.Op.lte]: now, [Sequelize.Op.gte]: yesterday }
    }
  })

  // It is highly likely that there is no QoTD previously set for a certain day
  // so let's just generate a random one from our pool of multiple choice questions
  if (!qotd) {
    let question
    let questionsCount = await Question.count()

    if(questionsCount > 0){
      while (!question) {
        question = await Question.findById(Math.floor(Math.random() * count))
      }
      qotd = await Session.create({
        day: new Date().toDateString('en-US', { timeZone: 'Europe/Bucharest' }),
        choiceQuestionId: question.id
      })
      qotd.choiceQuestion = question
    

      const existing = await Answer.findOne({ where: { day: qotd.day, userId } })
      if (existing) return next({ status: 400 })

      payload = { day: qotd.day, text: qotd.choiceQuestion.text }
      payload.answers = shuffle(
        qotd.choiceQuestion.answers.invalid.concat(
          qotd.choiceQuestion.answers.valid
        )
      )
    }
  }

  res.json(payload)
})

sessionsRouter.post('/', async (req, res, next) => {
  const { qotd, day } = req.body
  const { id: adminId } = req.session.user

  if (!qotd) return next({ status: 400 })

  // Should probably use findOrCreate instead
  // One cannot modify the QoTD after it has been
  // auto-generated
  const existing = await Session.findOne({
    where: { day: new Date(day).toDateString() }
  })
  if (existing) return next({ status: 400 })

  const session = await Session.create({
    choiceQuestionId: qotd,
    adminId,
    day
  })

  res.json({ id: session.id, qotd, day })
})

module.exports = sessionsRouter
