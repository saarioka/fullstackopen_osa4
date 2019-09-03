const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try{
    const blog = await Blog.find({})
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
    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes === undefined ? 0 : body.likes,
    })

    try {
      const savedBlog = await blog.save()
      response.json(savedBlog)
    } catch(exception) {
      next(exception)
    }
  }
})

module.exports = blogsRouter
