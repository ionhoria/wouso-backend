module.exports = {
    install: function ({ db, logger }) {
      this.db = db
      this.logger = logger
  
      const router = require('express').Router()
  
      const leaderboardRouter = require('./routes/leaderboard')

  
      const cors = require('cors')
      router.get('/', (req, res, next) => {
        res.json({ message: 'Hello, world!' })
      })
      router.use(
        cors({
          origin: /.*/g,
          optionsSuccessStatus: 200,
          credentials: true
        })
      )
      router.use('/leaderboard', leaderboardRouter)
   
  
      this.logger.debug('wouso-qotd installed!')
  
      return router
    },
    uninstall: function () {
      this.logger.debug('wouso-leaderboard uninstalled!')
    }
  }
  