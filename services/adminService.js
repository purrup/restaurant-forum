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
  editRestaurant: (req, rs, cb) => {
    Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        mode = 'edit'
        cb({ restaurant, mode, categories })
      })
    })
  },
  putRestaurant: (req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name didn't exist"})
    }

    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return Restaurant.findByPk(req.params.id).then(restaurant => {
          restaurant
            .update({
              name: req.body.name,
              tel: req.body.tel,
              address: req.body.address,
              opening_hours: req.body.opening_hours,
              description: req.body.description,
              image: file ? img.data.link : restaurant.image,
              CategoryId: req.body.categoryId,
            })
            .then(restaurant => {
              cb({ status: 'success', message: 'restaurant was successfully updated' })
            })
        })
      })
    } else
      return Restaurant.findByPk(req.params.id).then(restaurant => {
        restaurant
          .update({
            name: req.body.name,
            tel: req.body.tel,
            address: req.body.address,
            opening_hours: req.body.opening_hours,
            description: req.body.description,
            image: null,
            CategoryId: req.body.categoryId,
          })
          .then(restaurant => {
            cb({ status: 'success', message: 'restaurant was successfully updated' })
          })
      })
  },
  deleteRestaurant: (req, res, cb) => {
    return Restaurant.findByPk(req.params.id)
      .then((restaurant) => {
        restaurant.destroy()
          .then((restaurant) => {
            cb({ status: 'success', message: '' })
          })
      })
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
  postCategory:(req, res, cb) => {
    if (!req.body.name) {
      return cb({ status: 'error', message: "name didn't exist"})
    } else {
      return Category.create({
        name: req.body.name,
      }).then(category => {
        cb({ status: 'success', message: 'category was successfully created' })
      })
    }
  },
  putCategory: (req, res, cb) => {
    if (!req.body.name) {
      cb({ status: 'error', message: "name didn't exist"})
      } else {
        return Category.findByPk(req.params.id).then(category => {
          category.update(req.body).then(category => {
            cb({ status: 'success', message: 'Category was successfully updated' })
          })
        })
      }
  },
}

module.exports = adminService