let restController = {
  getRestaurants: (req, res) => {
    return res.render('restaurants', { user: req.user })
  },
}
module.exports = restController
