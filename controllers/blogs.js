const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blog = await Blog
      .find({})
      .populate('user', { username: 1, name: 1, id: 1})

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
    try{
      response.status(400).end()
    } catch(exception) {
      next(exception)
    }
  } else {
    //const user = await User.findById(body.userId)
    const user = await User.findById("5d779c37c11b49171402050e") // todo

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
      user: user,
    })

    try {
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
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
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
