const express = require('express')
const { User } = require('../models')

const router = express.Router()

router.get('/', async (req, res) => {
   const users = await User.findAll({
    order: [['score', 'DESC']]
   })
   const result = []
   users.forEach((element) => {
    result.push({
      username: element.username,
      firstName: element.firstName,
      lastName: element.lastName,
      score: element.score
    })
  })
    res.json(result)
  })

module.exports = router
