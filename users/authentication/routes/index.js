const authenticationRouter = require('express').Router()
const HttpStatus = require('http-status-codes')
const logger = require('../../../logger')
const User = require('../../models/user')
const requiresLogin = require('../../../utils/routes').requiresLogin

authenticationRouter.get(
  '/authentication',
  requiresLogin,
  async (req, res, next) => {
    const user = await User.findByPk(req.session.user.id)
    res.json({ ...req.session.user, score: user.score })
  }
)

authenticationRouter.post('/authentication', async (req, res, next) => {

  // Bypass LDAP authentication if NOT running in production mode.
  if (process.env.NODE_ENV !== 'production') {
    const session = req.session
    const {
      id,
      username,
      email,
      firstName,
      lastName,
      score
    } = await User.findByPk(1)
    session.user = {
      id,
      username,
      email,
      firstName,
      lastName,
      score
    }

    return res.json(session.user)
  }

  // Attempt regular LDAP authentication if running in production
  const {
    body: { username: reqUsername, password: reqPassword },
    session
  } = req

  if (!reqUsername || !reqPassword) {
    return next({
      message: 'Missing username or password.',
      status: HttpStatus.BAD_REQUEST
    })
  }

  const user = await User.authenticate(reqUsername, reqPassword).catch(
    ({ message, userExists }) => {
      return next({
        message,
        status: userExists ? HttpStatus.UNAUTHORIZED : HttpStatus.NOT_FOUND
      })
    }
  )
  if (!user) return next({ status: 500 })

  const { id, username, email, firstName, lastName, score } = user
  session.user = {
    id,
    username,
    email,
    firstName,
    lastName,
    score
  }

  res.json(session.user)
})

authenticationRouter.post('/signout', requiresLogin, (req, res, next) => {
  req.session.destroy()
  res.json({})
})

module.exports = authenticationRouter
