const { database } = require('../config')

module.exports = {
  development: {
    username: database.username,
    password: database.password,
    database: database.name,
    host: database.host,
    dialect: database.dialect,
    operatorsAliases: false
  },
  test: {
    username: 'root',
    password: null,
    database: 'database_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    username: 'root',
    password: null,
    database: 'database_production',
    host: '127.0.0.1',
    dialect: 'mysql'
  }
}
