const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blog = await Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1 })

    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch(exception) {
    next(exception)
  }
})

blogsRouter.post('/', async (request, response, next) => {
  const body = request.body

  if (body.title === undefined || body.url === undefined) {
    response.status(400).end()

  } else {
    try {
      const decodedToken = jwt.verify(request.token, process.env.SECRET)

      if (!request.token || !decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }

      const user = await User.findById(decodedToken.id)

      const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes === undefined ? 0 : body.likes,
        user: user,
      })

      const savedBlog = await blog.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()
      response.json(savedBlog)
    } catch(exception) {
      next(exception)
    }
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)

    if (!request.token || !decodedToken.id) {
      return request.status(401).json({ error: 'token missing or invalid' })
    }

    const removedBlog = await Blog.findById(request.params.id)
    const remover = await User.findById(decodedToken.id)

    if (remover._id.toString() === removedBlog.user.toString()) {
      await Blog.findByIdAndRemove(request.params.id)
      remover.status(204).end()
    } else {
      remover.status(401).end()
    }
  } catch (exception) {
    next(exception)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  const body = request.body

  if (body.title === undefined || body.url === undefined) {
    try{
      response.status(400).end()
    } catch(exception) {
      next(exception)
    }
  } else {
    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
    }

    try {
      const savedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
      response.json(savedBlog)
    } catch(exception) {
      next(exception)
    }
  }
})

module.exports = blogsRouter
