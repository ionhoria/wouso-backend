module.exports = {
  install: function ({ db, logger }) {
    this.db = db
    this.logger = logger

    const router = require('express').Router()
    const challengesRouter = require('./routes/challengesRouter')

    const cors = require('cors')

    router.use(
      cors({
        origin: /.*/g,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )

    router.use('/', challengesRouter)

    this.logger.debug('wouso-challenge installed!')

    return router
  },
  uninstall: function () {
    this.logger.debug('wouso-challenge uninstalled!')
  }
}
