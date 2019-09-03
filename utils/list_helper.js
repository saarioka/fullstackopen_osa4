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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
