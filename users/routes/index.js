const usersRouter = require('express').Router()

const authenticationRouter = require('../authentication/routes')

usersRouter.use('/', authenticationRouter)

module.exports = usersRouter
