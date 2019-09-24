module.exports = {
  install: function ({ db, logger }) {
    this.db = db
    this.logger = logger

    const router = require('express').Router()

    const challengeRouter = require('./routes/challengeRouter')

    const cors = require('cors')
    router.use(
      cors({
        origin: /.*/g,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )

    router.use('/', challengeRouter)

    this.logger.debug('challenge installed!')

    return router
  },
  uninstall: function () {
    this.logger.debug('challenge uninstalled!')
  }
}
