const { Question, Session } = require('./models')

const setup = async () => {
  const exists = await Session.findOne({
    where: {
      name: 'Here’s to the crazy ones… and zeros!'
    }
  })

  const qs = [
    {
      text: 'http://swarm.cs.pub.ro/~matei.oprea/.wouso/letsplayagame.gif',
      answer: 'Wouso'
    },
    { text: ':(){ :|: & };: prevention', answer: 'ulimit' },
    { text: "the piramids weren't built in 10 days", answer: 'javascript' },
    {
      text: 'Never has a snake given such words of wisdom.',
      answer: 'the Zen of Python'
    },
    {
      text: 'http://swarm.cs.pub.ro/~vciurel/.wouso/obfuscate',
      answer: 'abcefostu'
    },
    {
      text: 'http://swarm.cs.pub.ro/~vciurel/.wouso/hello.sh ',
      answer: 'BATMAN'
    },
    {
      text: 'http://swarm.cs.pub.ro/~matei.oprea/.wouso/findme',
      answer: 'youshallnotpass'
    },
    {
      text: 'http://swarm.cs.pub.ro/~vciurel/.wouso/++',
      answer: 'urban muller'
    },
    {
      text: 'http://swarm.cs.pub.ro/~vciurel/.wouso/pi',
      answer: 'PAIN'
    },
    {
      text: 'http://swarm.cs.pub.ro/~vciurel/.wouso/magic_numbers.c ',
      answer: 'FUN'
    }
  ]

  if (!exists) {
    const session = await Session.create({
      name: 'Here’s to the crazy ones… and zeros!',
      start: '2019-01-11 21:00:00',
      end: '2019-01-13 21:00:00'
    })
    qs.forEach(async (q, index) => {
      const question = await Question.create(q)
      await session.addQuestion(question, {
        through: { questionIndex: index }
      })
    })
  }
}

setup()
