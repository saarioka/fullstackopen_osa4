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


module.exports = {
  dummy,
  totalLikes
}
