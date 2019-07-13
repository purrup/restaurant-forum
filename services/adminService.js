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
}

module.exports = adminService