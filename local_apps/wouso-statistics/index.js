let listener = null

module.exports = {
  install: function ({ db, logger, activity }) {
    this.db = db
    this.logger = logger
    this.activity = activity

    const Hit = db.define(
      'statistics_hits',
      {
        appName: {
          type: db.Sequelize.STRING
        },
        endpoint: {
          type: db.Sequelize.STRING
        },
        method: {
          type: db.Sequelize.STRING
        },
        statusCode: {
          type: db.Sequelize.INTEGER
        },
        count: {
          type: db.Sequelize.INTEGER,
          defaultValue: 0
        }
      },
      { timestamps: false }
    )

    const router = require('express').Router()

    router.get('/:appName', async (req, res, next) => {
      res.json(await Hit.findAll({ where: { appName: req.params.appName } }))
    })

    listener = async ({ method, endpoint, statusCode }) => {
      const tokens = endpoint.split('/')

      if (tokens.length < 3) {
        return
      }

      const appName = tokens[2]

      const result = await Hit.findOrCreate({
        where: { appName, method, endpoint, statusCode },
        defaults: { appName, method, endpoint, statusCode }
      })

      await Hit.increment('count', {
        where: { appName, method, endpoint, statusCode }
      })
    }

    activity.on('apps:endpointHit', listener)

    this.logger.debug('wouso-statistics installed!')

    return router
  },
  uninstall: function () {
    this.activity.removeListener('apps:endpointHit', listener)

    this.logger.debug('wouso-statistics uninstalled!')
  }
}
