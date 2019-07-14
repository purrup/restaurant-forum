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
  postRestaurant: (req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name didn't exist"})
    }
    const { file } = req // equal to const file = req.file
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.create({
          name: req.body.name,
          tel: req.body.tel,
          address: req.body.address,
          opening_hours: req.body.opening_hours,
          description: req.body.description,
          image: file ? img.data.link : null,
          CategoryId: req.body.categoryId
        }).then((restaurant) => {
          cb({ status: 'success', message: 'restaurant was successfully created' })
        })
      })
    } else {
      return Restaurant.create({
        name: req.body.name,
        tel: req.body.tel,
        address: req.body.address,
        opening_hours: req.body.opening_hours,
        description: req.body.description,
        CategoryId: req.body.categoryId
      })
        .then((restaurant) => {
          cb({ status: 'success', message: 'restaurant was successfully created' })
        })
    }
  },
  deleteRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            cb({ status: 'success', message: '' })
          })
      })
  }
}

module.exports = adminService