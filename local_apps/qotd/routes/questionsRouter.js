const express = require('express')
const { logger } = require('../index')
const { Question, Tag } = require('../models')
const requiresLogin = require('../../../utils/routes').requiresLogin

const questionsRouter = express.Router()

questionsRouter.get('/', requiresLogin, async (req, res, next) => {
  try {
    const questions = await Question.findAll({
      attributes: ['id', 'text', 'answers'],
      include: {
        model: Tag,
        attributes: ['name'],
        through: { attributes: [] }
      }
    })
    res.json(questions)
  } catch (error) {
    logger.error(error)
    next({ status: 500 })
  }
})

questionsRouter.post('/', async (req, res, next) => {
  /*
   * text: 'text'
   * answers: {valid: 'yes', invalid: ['nein', 'no', 'no way']}
   * tags: [2, 'special', 47]
   */
  const { text, answers, tags } = req.body

  try {
    const question = await Question.create({ text, answers })

    /*
     * Some of the received tags may be specified as text (i.e. custom import).
     * We want to handle this case, but question.addTags() only takes an array
     * of tag ids. We therefore findOrCreate all string tags and build an array
     * of just tag ids.
     */
    const newTags = []
    for (const tag of tags) {
      if (typeof tag === 'string') {
        Tag.findOrCreate({
          where: { name: tag },
          defaults: { name: tag }
        }).spread((tag, created) => {
          newTags.push(tag.id)
        })
      } else {
        newTags.push(tag)
      }
    }
    await question.addTags(newTags) // Create tag associations
    res.json(await Question.findByPk(question.id))
  } catch (error) {
    logger.error(error)
    next({ status: 500 })
  }
})

module.exports = questionsRouter
