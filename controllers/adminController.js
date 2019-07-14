const fs = require('fs')
const db = require('../models')
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const { Restaurant, User, Category } = db
const adminService = require('../services/adminService')


let mode = ''

const adminController = {
  getRestaurants: (req, res) => {
    adminService.getRestaurants(req, res, (data) => {
      return res.render('admin/restaurants', data)
    })
  },

  createRestaurant: (req, res) => {
    Category.findAll().then(categories => {
      mode = 'create'
      return res.render('admin/create', { mode, categories })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
    // if (!req.body.name) {
    //   req.flash('error_messages', "name didn't exist")
    //   return res.redirect('back')
    // }

    // const { file } = req
    // if (file) {
    //   imgur.setClientID(IMGUR_CLIENT_ID)
    //   imgur.upload(file.path, (err, img) => {
    //     return Restaurant.create({
    //       name: req.body.name,
    //       tel: req.body.tel,
    //       address: req.body.address,
    //       opening_hours: req.body.opening_hours,
    //       description: req.body.description,
    //       image: file ? img.data.link : null,
    //       CategoryId: req.body.categoryId,
    //     }).then(restaurant => {
    //       req.flash('success_messages', 'restaurant was successfully created')
    //       return res.redirect('/admin/restaurants')
    //     })
    //   })
    // } else {
    //   return Restaurant.create({
    //     name: req.body.name,
    //     tel: req.body.tel,
    //     address: req.body.address,
    //     opening_hours: req.body.opening_hours,
    //     description: req.body.description,
    //     image: null,
    //     CategoryId: req.body.categoryId,
    //   }).then(restaurant => {
    //     req.flash('success_messages', 'restaurant was successfully created')
    //     return res.redirect('/admin/restaurants')
    //   })
    // }
  },

  getRestaurant: (req, res) => {
    adminService.getRestaurant(req, res, (data) => {
      return res.render('admin/restaurant', data)
    })
  },

  editRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id).then(restaurant => {
      Category.findAll().then(categories => {
        mode = 'edit'
        return res.render('admin/create', { restaurant, mode, categories })
      })
    })
  },

  postRestaurant: (req, res) => {
    adminService.postRestaurant(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/restaurants')
    })
  },

 deleteRestaurant: (req, res) => {
    adminService.deleteRestaurant(req, res, (data) => {
      if (data['status'] === 'success') {
        return res.redirect('/admin/restaurants')
      }
    })
  },
  editUser: (req, res) => {
    return User.findAll().then(users => {
      return res.render('admin/users', {
        users,
      })
    })
  },
  putUser: (req, res) => {
    return User.findByPk(req.params.id).then(user => {
      user
        .update({
          isAdmin: !user.isAdmin,
        })
        .then(user => {
          req.flash('success_messages', 'Authority was successfully to change!')
          res.redirect('/admin/users')
        })
    })
  },
}
module.exports = adminController
