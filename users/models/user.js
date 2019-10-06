// const bcrypt = require('bcrypt')
const ldap = require('ldapjs')
const ldapConfig = require('../../config').ldap
const db = require('../../db')
const logger = require('../../logger')

const User = db.define('users', {
  username: {
    type: db.Sequelize.STRING,
    unique: {
      msg: 'This username is already registered.'
    },
    allowNull: false,
    set (val) {
      this.setDataValue('username', val.toLowerCase().trim())
    }
  },
  email: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  firstName: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  lastName: {
    type: db.Sequelize.STRING,
    allowNull: false
  },
  score: {
    type: db.Sequelize.INTEGER,
    defaultValue: 60,
    allowNull: false
  },
  elo: {
    type: db.Sequelize.INTEGER,
    defaultValue: 1000,
    allowNull: false
  }
})

delete User.bulkCreate

// Performs LDAP authentication
User.authenticate = (username, password) =>{
  return new Promise((resolve, reject) => {
    const client = ldap.createClient({ url })
    client.on('error', err => {
      return reject({})
    })
    client.bind(bindName, bindPass, err => {
      if (err) return reject({})
    })
    const searchOptions = {
      scope: 'sub',
      filter: `uid=${username}`,
      sizeLimit: 1,
      attributes: ['uid', 'givenName', 'sn', 'mail']
    }

    client.search(base, searchOptions, (err, res) => {
      if (err) return reject({})
      let user = null
      res.on('searchEntry', entry => {
        user = entry.object
      })
      res.on('searchReference', referral => {
        client.unbind(err => {})
        return reject({})
      })
      res.on('error', err => {
        client.unbind(err => {})
        return reject({})
      })
      res.on('end', async result => {
        if (!user || result.status != 0) return reject({})
        client.bind(user.dn, password, err => {
          if (err) return reject({})
        })
        await User.findOrCreate({
          where: { username: user.uid },
          defaults: {
            username: user.uid,
            email: user.mail,
            firstName: user.givenName,
            lastName: user.sn
          }
        })
          .spread((user, created) => {
            if (created) logger.info(`Created user for ${user.username}`)
            resolve(user)
          })
          .catch(() => reject({}))
        client.unbind(err => {
          logger.error('Final ldap unbind failed!')
        })
      })
    })
  })
}
User.sync()

module.exports = User
