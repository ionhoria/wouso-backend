module.exports = {
  ROOT_PATH: '/home/linux_admin/wouso-content-private/final-quest/task-',
  ANSWER_FORMAT: /^[a-z0-9/+\-=<> .,\[\]]+$/i,
  /*
   * Scoring parameters. Score is calculated as follows:
   * scoreDelta = BASE + questionIndex * MULTIPLIER
   * Questions are indexed starting from 0
   */
  BASE: 20,
  MULTIPLIER: 10
}
