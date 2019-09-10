const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

usersRouter.get('/', async (request, response, next) => {
  try{
    const user = await User
    .find({})
    .populate('blogs', { url: 1, title: 1, author: 1, id: 1 })

    if (user) {
      response.json(user)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

usersRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body

    if (body.username === undefined || body.name === undefined || body.password === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash,
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (exception) {
    next(exception)
  }
})

usersRouter.delete('/:id', async (request, response, next) => {
  try {
    await User.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    next(exception)
  }
})

module.exports = usersRouter