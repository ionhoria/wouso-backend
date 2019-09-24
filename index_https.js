const fs = require('fs')
const http = require('http')
const https = require('https')
const express = require('express')
const cors = require('cors')

const config = require('./config')
const logger = require('./logger')
const session = require('./session')
const appsRouter = require('./apps/routes')
const usersRouter = require('./users/routes')

const app = express()

const { keyPath, certPath, caPath } = config.express.https
const credentials = {
  key: fs.readFileSync(keyPath, 'utf8'),
  cert: fs.readFileSync(certPath, 'utf8'),
  ca: fs.readFileSync(caPath, 'utf8'),
}

app.use(cors(config.cors))

app.use(express.json())

app.use((req, res, next) => {
  res._json = res.json

  res.json = data => res._json({ data })
  res.message = message => res.json({ message })

  next()
})

app.use(session)

app.use('/apps', appsRouter)

app.use('/users', usersRouter)

app.get('/', (req, res, next) => {
  res.message('Server is up and running.')
})

app.use((err, req, res, next) => {
  if (err) {
    console.log(err)
    logger.error(err)
    res.status(err.status || 400).message(err.message)
  }
})

const httpsServer = https.createServer(credentials, app)

httpsServer.listen(config.express.port, config.express.host, () =>
  logger.info(
    `HTTPS server listening on ${config.express.host}:${config.express.port}.`
  )
)
