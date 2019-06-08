const db = require('../models')
const Restaurant = db.Restaurant
let mode = ''

const adminController = {
  getRestaurants: (req, res) => {
    return Restaurant.findAll().then(restaurants => {
      // const userAdmin = req.user.isAdmin
      return res.render('admin/restaurants', {
        // userAdmin,
        restaurants,
      })
    })
  },

  createRestaurant: (req, res) => {
    const restaurant = {
      name: '',
      tel: '',
      address: '',
      opening_hours: '',
      description: '',
    }
    mode = 'create'
    return res.render('admin/create', { restaurant, mode })
  },

  postRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }
    return Restaurant.create({
      name: req.body.name,
      tel: req.body.tel,
      address: req.body.address,
      opening_hours: req.body.opening_hours,
      description: req.body.description,
    }).then(restaurant => {
      req.flash('success_messages', 'restaurant was successfully created')
      res.redirect('/admin/restaurants')
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      return res.render('admin/restaurant', {
        restaurant: restaurant,
      })
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      mode = 'edit'
      return res.render('admin/create', { restaurant, mode })
    })
  },

  putRestaurant: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    }

    return Restaurant.findByPk(req.params.id).then(restaurant => {
      restaurant
        .update({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
        })
        .then(restaurant => {
          req.flash('success_messages', 'restaurant was successfully to update')
          res.redirect('/admin/restaurants')
        })
    })
  },
}
module.exports = adminController
