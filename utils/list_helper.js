const lodash = require('lodash')

const dummy = (blogs) => {
  blogs
  return 1
}

const totalLikes = (blogs) => {
  const summer = (sum, item) => {
    return sum + item.likes
  }

  return blogs.reduce(summer, 0)
}

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return NaN
  }

  return blogs.reduce(
    (prev, current) => {
      return (prev.likes > current.likes)
        ? prev
        : lodash.pick(current, ['title', 'author', 'likes'])
    }
    , lodash.pick(blogs[0], ['title', 'author', 'likes'])
  )
}

const mostBlogs = (blogs) => {
  if(blogs.length === 0) {
    return NaN
  }

  const blogsByAuthor = lodash.groupBy(blogs, 'author')

  const blogNumberByAuthor = lodash.mapValues(
    blogsByAuthor, (authorBlogs) => { return authorBlogs.length }
  )

  const authorWithMostBlogs = lodash.max(Object.keys(blogNumberByAuthor), o => blogNumberByAuthor[o])

  return {
    'author' : authorWithMostBlogs,
    'blogs' : blogNumberByAuthor[authorWithMostBlogs]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
}
