module.exports = {
  install: function ({ db, logger }) {
    this.db = db
    this.logger = logger

    const router = require('express').Router()

    const questionsRouter = require('./routes/questionsRouter')
    const answersRouter = require('./routes/answersRouter')
    const sessionsRouter = require('./routes/sessionsRouter')

    // const doShit = require('./demo')
    // doShit()

    const cors = require('cors')

    router.use(
      cors({
        origin: /.*/g,
        optionsSuccessStatus: 200,
        credentials: true
      })
    )

    router.get('/', (req, res, next) => {
      res.json({ message: 'Hello, world!' })
    })

    router.use('/questions', questionsRouter)
    router.use('/answers', answersRouter)
    router.use('/sessions', sessionsRouter)

    this.logger.debug('wouso-test-app installed!')

    return router
  },
  uninstall: function () {
    this.logger.debug('wouso-test-app uninstalled!')
  }
}
