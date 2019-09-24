module.exports = {
  install: function ({ db, logger }) {
    this.db = db
    this.logger = logger

    const router = require('express').Router()

    const finalRouter = require('./routes/finalRouter')
    const cors = require('cors')
    router.use(
      cors({
        origin: /.*/g,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )

    router.use('/', finalRouter)

    this.logger.debug('final installed!')
    require('./setup.js')

    return router
  },
  uninstall: function () {
    this.logger.debug('final uninstalled!')
  }
}
