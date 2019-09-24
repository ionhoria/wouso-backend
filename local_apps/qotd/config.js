const moment = require('moment')

const START_DATE = moment('2018-09-24T00:00:00+0300') // MONDAY, 24 SEP 2018, GMT+3
const SCORE = 20
const DOUBLE_TIME = 12 // Answers posted in the first DOUBLE_TIME hours get double the SCORE
const TAG = {
  SISTEM_FISIERE: 'sistem-fisiere',
  PROCESE: 'procese',
  GESTIUNEA_UTILIZATORILOR: 'gestiunea-utilizatorilor',
  RETELE: 'retele',
  SERVICII_RETEA: 'servicii-de-retea',
  VIM: 'vim',
  INTRO: 'intro',
  SPECIAL: 'special',
  VIRTUALIZARE: 'virtualizare',
  COMPILARE: 'compilare',
  SHELL_SCRIPTING: 'shell-scripting',
  HARDWARE: 'hardware',
  SECURITATE: 'securitate'
}

const WEEK_TAG = {
  0: TAG.INTRO,
  1: TAG.SISTEM_FISIERE,
  2: TAG.PROCESE,
  3: TAG.GESTIUNEA_UTILIZATORILOR,
  4: null,
  5: TAG.VIM,
  6: TAG.HARDWARE,
  7: null,
  8: TAG.RETELE,
  9: null, // Liber 1 decembrie
  10: TAG.VIRTUALIZARE,
  11: TAG.SECURITATE,
  12: TAG.SHELL_SCRIPTING,
  13: TAG.SPECIAL
}

module.exports = {
  ACTIVE: true,
  START_DATE,
  SCORE,
  DOUBLE_TIME,
  TAG,
  WEEK_TAG
}
