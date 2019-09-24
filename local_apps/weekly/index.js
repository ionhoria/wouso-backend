module.exports = {
  install: function ({ db, logger }) {
    this.db = db
    this.logger = logger

    const router = require('express').Router()

    const weeklyRouter = require('./routes/weeklyRouter')
    const cors = require('cors')
    router.use(
      cors({
        origin: /.*/g,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )

    router.use('/', weeklyRouter)

    this.logger.debug('weekly installed!')
    require('./setup.js')

    return router
  },
  uninstall: function () {
    this.logger.debug('weekly uninstalled!')
  }
}
