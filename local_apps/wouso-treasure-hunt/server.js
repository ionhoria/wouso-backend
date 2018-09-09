const util = require('util')
const exec = util.promisify(require('child_process').exec)

const axios = require('axios')

const main = async () => {
  const name = require('./package.json').name

  while (true) {
    try {
      require('./wouso-core-backend')
      break
    } catch (err) {
      await exec(
        `git clone https://github.com/razvanch/wouso-backend/ wouso-core-backend \
        && cd wouso-core-backend \
        && yarn install \
        && cp config/index.js.example config/index.js`
      )
    }
  }

  const config = require('./wouso-core-backend/config')
  const rootUrl = `http://${config.express.host}:${config.express.port}`

  axios.post(`${rootUrl}/apps`, { url: `file:${__dirname}`, replace: true })
}

main()
