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
  } else if (blogs.length === 1) {
    return {
      'title' : blogs[0].title,
      'author': blogs[0].author,
      'likes': blogs[0].likes
    }
  }

  return blogs.reduce(
    (prev, current) => {
      return (prev.likes > current.likes)
        ? prev
        : {
          'title' : current.title,
          'author': current.author,
          'likes': current.likes
        }
    }
  )
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
}
