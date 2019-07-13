const fs = require('fs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { Restaurant, User, Category } = db

let mode = ''

const adminService = {
  getRestaurants: (req, res, cb) => {
    return Restaurant.findAll({ include: [Category] }).then(restaurants => {
      cb({ restaurants })
    })
  },
  getRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id, { include: [Category] }).then(
      restaurant => {
        cb({ restaurant })
      }
    )
  },
  getCategories: (req, res, cb) => {
    return Category.findAll().then(categories => {
      if (req.params.id) {
        Category.findByPk(req.params.id).then(category => {
          cb({
            categories: categories,
            category: category,
          })
        })
      } else {
        return cb({ categories: categories })
      }
    })
  },
  deleteRestaurant: (req, res, callback) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            callback({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService