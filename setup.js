const logger = require('./logger')
const User = require('./users/models/user')
const db = require('./db')

const createUsers = async users =>
  users.forEach(async data => {
    try {
      await User.create(data)
    } catch (err) {
      if (!(err instanceof db.Sequelize.UniqueConstraintError)) throw err
      logger.info(`User ${data.username} already exists.`)
      return
    }

    try {
      await User.authenticate(data.username, data.password)
      logger.info(`Created user '${data.username}.`)
    } catch (err) {
      logger.error(`Error creating user '${data.username}:`, err)
    }
  })

const main = async () => {
  const users = [
    {
      username: 'admin',
      password: 'admin',
      email: 'razvan.m.chitu@gmail.com',
      firstName: 'Razvan',
      lastName: 'Chitu'
    },
    {
      username: 'intern',
      password: 'intern',
      email: 'horiapaulion@gmail.com',
      firstName: 'Horia',
      lastName: 'Ion'
    }
  ]

  await createUsers(users)
}

setTimeout(main, 1000)
