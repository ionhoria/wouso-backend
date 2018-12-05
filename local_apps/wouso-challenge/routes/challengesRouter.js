const express = require('express')
const Sequelize = require('sequelize')
const { Challenge, Question, Answer, User } = require('../models')
const requiresLogin = require('../../../utils/routes').requiresLogin

const { EXPIRATION } = require('../config')
// const Op = Seqelize.Op

const router = express.Router()

router.get('/', requiresLogin, async (req, res, next) => {
  const userId = req.session.user.id
  const challenges = await Challenge.findAll({
    where: Sequelize.or({ sender: userId }, { receiver: userId }),
    include: { all: true },
    order: [['expires', 'DESC']]
  })
  const payload = []
  challenges.forEach(challenge => {
    const { id, expires, status, victory } = challenge
    if (userId === challenge.sender) {
      const receiver = `${challenge.receiverName.firstName} ${challenge.receiverName.lastName}`
      payload.push({ id, receiver, expires, status, victory })
    } else {
      const sender = `${challenge.senderName.firstName} ${challenge.senderName.lastName}`
      payload.push({ id, sender, expires, status, victory })
    }
  })
  return res.json(payload)
})

router.get('/users', requiresLogin, async (req, res, next) => {
  const users = await User.findAll({
    attributes: ['id', 'firstName', 'lastName', 'userName'],
    where: { id: { [Sequelize.Op.ne]: req.session.user.id } }
  })
  return res.json(users)
})

router.post('/challenge', requiresLogin, async (req, res, next) => {
  const sender = req.session.user.id
  const receiver = req.body.id

  // Check if the user being challenged exists
  const user = await User.findById(receiver)
  const existing = await Challenge.findOne({
    where: {
      receiver,
      [Sequelize.Op.and]: {
        expires: { [Sequelize.Op.gt]: Date.now() },
        status: { [Sequelize.Op.ne]: 'declined' }
      }
    }
  })
  if (!user || existing) return next({ status: 400 })

  let questionId = 0
  await Question.findAll({ attributes: ['id'] }).then(
    questions =>
      (questionId = parseInt(
        questions[Math.floor(Math.random() * questions.length)].id
      ))
  )

  if (questionId === 0) return next({ status: 500 })

  const challenge = await Challenge.create({
    sender,
    receiver,
    expires: new Date(Date.now() + EXPIRATION),
    questionId
  })

  return res.json(challenge)
})

router.post('/accept', requiresLogin, async (req, res, next) => {
  const challenge = await Challenge.update(
    {
      status: 'accepted',
      expires: new Date(Date.now() + EXPIRATION)
    },
    {
      where: {
        receiver: req.session.user.id,
        status: 'pending',
        expires: { [Sequelize.Op.gt]: Date.now() }
      }
    }
  )

  if (challenge[0] === 0) {
    return next({ status: 400 })
  }
  Answer.create({ userId: challenge[0].sender, challengeId: challenge[0].id })
  Answer.create({ userId: challenge[0].receiver, challengeId: challenge[0].id })

  return res.json(challenge)
})

router.post('/decline', requiresLogin, async (req, res, next) => {
  const challenge = await Challenge.update(
    {
      status: 'declined'
    },
    {
      where: {
        receiver: req.session.user.id,
        status: 'pending',
        expires: { [Sequelize.Op.gt]: Date.now() }
      }
    }
  )

  if (challenge[0] === 0) {
    return next({ status: 400 })
  }

  return res.json({})
})

router.get('/question', requiresLogin, async (req, res, next) => {
  const userId = req.session.user.id
  // const challenge = await Challenge.findOne({ where })
  res.json({})
})

module.exports = router
