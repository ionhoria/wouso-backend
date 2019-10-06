const { Fight, Challenge, Question } = require('../models');
const shuffle = require('lodash/shuffle');
const moment = require('moment');
const express = require('express');
const Sequelize = require('sequelize');
const { logger } = require('../index');
const User = require('../../../users/models/user');
const challenge = require('../models/challenge');
const requiresLogin = require('../../../utils/routes').requiresLogin;
const { QUERY_FORMAT } = require('../config');

const challengeRouter = express.Router();

challengeRouter.get('/', async (req, res, next) => {
  res.json({ message: 'hello' });
});

challengeRouter.get('/users', requiresLogin, async (req, res, next) => {
  const query = req.query.name;
  console.log(query);
  if (!query || query.length < 3 || !QUERY_FORMAT.test(query)) {
    return next({ status: 400 });
  }
  const users = await User.findAll({
    attributes: ['firstName', 'lastName', 'username'],
    where: {
      [Sequelize.Op.and]: [
        { id: { [Sequelize.Op.ne]: req.session.user.id } },
        { username: { [Sequelize.Op.like]: `%${query}%` } },
      ],
    },
  });
  res.json(users);
});

challengeRouter.post('/add', async (req, res, next) => {
  const { challenger, challenged } = req.body;
  if (!challenged || !challenger || challenged === challenger) {
    return next({ status: 400 });
  }

  let existingChallenge = await Challenge.findAll({
    attributes: ['challenger', 'challenged', 'createdAt', 'status'],
    where: {
      [Sequelize.Op.or]: [
        { challenger: challenger },
        { challenged: challenged },
        { challenger: challenged },
        { challenged: challenger },
      ],
    },
  });
  existingChallenge = existingChallenge.filter((element) => element.status === "pending" || element.status === "accepted" );
  existingChallenge = existingChallenge.filter((element) =>  {
    var exp = moment(element.createdAt, 'DD.MM.YYYY HH:mm:ss');
    return moment().diff(exp, 'hours') < 24
  });
  
  if (existingChallenge.length != 0 && existingChallenge !== null ) {
    res.status(400);
    res.json(existingChallenge);
  } else {
    const newChallenge = await Challenge.create({
      challenger: challenger,
      challenged: challenged,
      status: 'pending',
    });
    res.json(newChallenge);
  }
});

challengeRouter.post('/accept', async (req, res, next) => {
  const { challenger, challenged, stake } = req.body;

  const q = await Question.findAll({
    attributes: ['id', 'text', 'createdAt'],
    order: [
    Sequelize.fn( 'RAND' ),
  ],
  limit: 2,
})
 console.log(q)
  if (!challenged || !challenger || challenged.length < 3 || challenger.length < 3) {
    return next({ status: 400 });
  }
  const existingChallenge = await Challenge.findOne({
    attributes: ['challenger', 'challenged', 'createdAt', 'status'],
    where: {
      [Sequelize.Op.and]: [{ challenger: challenger }, { challenged: challenged }, { status: "pending" }],
    },
  });
  if(existingChallenge === null){
    return next({ status: 400 });
  }
  var exp = moment(existingChallenge.createdAt, 'DD.MM.YYYY HH:mm:ss');

  if (moment().diff(exp, 'hours') > 24) {
    try {
      await Challenge.update(
        { status: 'expired' },
        {
          where: {
            [Sequelize.Op.and]: [{ challenger: challenger }, { challenged: challenged }],
          },
        },
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return next({ status: 400 });
      }
      logger.error(error);
      return next({ status: 500 });
    }
  }
  else{
    try {
      await Challenge.update(
        { status: 'accepted' },
        {
          where: {
            [Sequelize.Op.and]: [{ challenger: challenger }, { challenged: challenged }],
          },
        },
      );
    } catch (error) {
      if (error.name === 'SequelizeUniqueConstraintError') {
        return next({ status: 400 });
      }
      logger.error(error);
      return next({ status: 500 });
    }
    const createFight = await Fight.create({
      challenger: challenger,
      challenged: challenged,
      stake: stake,
    });
    res.json(createFight)
  }

  res.status(200);
});

module.exports = challengeRouter;
