const { Fight, Challenge } = require('../models')
const shuffle = require('lodash/shuffle')
const moment = require('moment')
const express = require('express')
const Sequelize = require('sequelize')
const { logger } = require('../index')
const User = require('../../../users/models/user')
const challenge = require('../models/challenge')
const requiresLogin = require('../../../utils/routes').requiresLogin
const { QUERY_FORMAT } = require('../config')


const challengeRouter = express.Router()

challengeRouter.get('/', async (req, res, next) => {
  res.json({ message: 'hello' })
})

challengeRouter.get('/users', requiresLogin, async (req, res, next) => {
  const query = req.query.name
  console.log(query)
  if (!query || query.length < 3 || !QUERY_FORMAT.test(query)) {
    return next({ status: 400 })
  }
  const users = await User.findAll({
    attributes: ['firstName', 'lastName', 'username'],
    where: {
      [Sequelize.Op.and]: [
        { id: { [Sequelize.Op.ne]: req.session.user.id } },
        { username: { [Sequelize.Op.like]: `%${query}%` } }
      ]
    }
  })
  res.json(users)
})

challengeRouter.post('/add', requiresLogin, async (req, res, next) => {
  const { challenger, challenged } = req.body
  res.json("req.body")
  console.log(req);
  // console.log("------------------------")
  // if (!challenged || !challenger || challenged.length < 3 || challenger.length < 3 ) {
  //   return next({ status: 400 })
  // }
  
  // const existingChallenge = await Challenge.findone({
  //   attributes: ['challenger', 'challenged', 'createdAt'],
  //   where: {
  //     [Sequelize.Op.or]: [
  //       { challenger:  challenger  },
  //       { challenged:  challenged  },
  //       { challenger:  challenged  },
  //       { challenged:  challenger  }
  //     ]
  //   }
  // })
  
  // if(challenge !== undefined){
  //   res.status(400)
  //   res.json(challenge)
  // }
  // else {
  //   const newChallenge = await Challenge.create({
  //     challenger: challenger,
  //     challenged: challenged,
  //     status: "pending"
  //   })
  //   res.json(newChallenge)
  // }
  
})

challengeRouter.post('/response', requiresLogin, async (req, res, next) => {
  const { challenger, challenged } = req.query

  if (!challenged || !challenger || challenged.length < 3 || challenger.length < 3 ) {
    return next({ status: 400 })
  }
  
  const challenge = await Challenge.findone({
    attributes: ['challenger', 'challenged', 'createdAt'],
    where: {
      [Sequelize.Op.or]: [
        { challenger:  challenger  },
        { challenged:  challenged  },
        { challenger:  challenged  },
        { challenged:  challenger  }
      ]
    }
  })
  
  if(challenge !== undefined){
    res.status(400)
    res.json(challenge)
  }
  else {
    const newChallenge = await Challenge.findAll({
      challenger: challenger,
      challenged: challenged
    })
    res.json(newChallenge)
  }
  
})

module.exports = challengeRouter
