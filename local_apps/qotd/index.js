module.exports = {
  install: function ({ db, logger }) {
    this.db = db
    this.logger = logger

    const router = require('express').Router()

    // const questionsRouter = require('./routes/questionsRouter')
    const qotdRouter = require('./routes/qotdRouter')

    const cors = require('cors')
    router.use(
      cors({
        origin: /.*/g,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )

    router.use('/', qotdRouter)
    // DANGEROUS! No admin permissions imlemented yet. Anyone could post questions!
    // router.use('/questions', questionsRouter)

    this.logger.debug('qotd installed!')

    return router
  },
  uninstall: function () {
    this.logger.debug('qotd uninstalled!')
  }
}
