const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany()

  const blogObjects = helper.initialBlogs
    .map(blog => new Blog(blog))
  const promises = blogObjects.map(blog => blog.save())
  await Promise.all(promises)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a specific blog is within the returned blogs', async () => {
  const response = await api.get('/api/blogs')

  const titles = response.body.map(r => r.title)

  expect(titles).toContain('React patterns')
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 't',
    author: 'a',
    url: 'asd',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)


  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(n => n.title)
  expect(titles).toContain('t')
})

test('blog without title is not added', async () => {
  const newBlogNoTitle = {
    author: 'a',
    url: 'asd',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlogNoTitle)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('blog without URL is not added', async () => {
  const newBlogNoURL = {
    title: 't',
    author: 'a',
    likes: 1
  }

  await api
    .post('/api/blogs')
    .send(newBlogNoURL)
    .expect(400)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
})

test('blog without field "likes" is added and set to 0 likes', async () => {
  const newBlog = {
    title: 't',
    author: 'a',
    url: 'asd',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  expect(blogsAtEnd[blogsAtEnd.length - 1]).toMatchObject({
    title: 't',
    author: 'a',
    url: 'asd',
    likes: 0
  })
})

afterAll(() => {
  mongoose.connection.close()
})