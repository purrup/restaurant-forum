const db = require('../models')
const moment = require('moment')
const Restaurant = db.Restaurant
const Category = db.Category
const Comment = db.Comment
const User = db.User
const pageLimit = 10
const getCreateTimeFromNow = createdAt => moment(createdAt).fromNow()

let restController = {
  getRestaurants: (req, res) => {
    let offset = 0
    let whereQuery = {}
    let categoryId = ''
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit
    }
    if (req.query.categoryId) {
      categoryId = Number(req.query.categoryId)
      whereQuery['CategoryId'] = categoryId
    }
    Restaurant.findAndCountAll({
      include: Category,
      where: whereQuery,
      offset: offset,
      limit: pageLimit,
    }).then(result => {
      // data for pagination
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(result.count / pageLimit)
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      )
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      // clean up restaurant data
      const data = result.rows.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
      }))
      Category.findAll().then(categories => {
        return res.render('restaurants', {
          restaurants: data,
          categories: categories,
          categoryId: categoryId,
          page: page,
          totalPage: totalPage,
          prev: prev,
          next: next,
        })
      })
    })
  },
  getRestaurant: (req, res) => {
    return Restaurant.findByPk(req.params.id, {
      include: [Category, { model: Comment, include: [User] }],
    }).then(restaurant => {
      return res.render('restaurant', {
        restaurant: restaurant,
        getCreateTimeFromNow: getCreateTimeFromNow, //把function傳到前端頁面去用
      })
    })
  },

  getFeeds: async (req, res) => {
    const restaurants = await Restaurant.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [Category],
    })
    const comments = await Comment.findAll({
      limit: 10,
      order: [['createdAt', 'DESC']],
      include: [User, Restaurant],
    })
    res.render('feeds', {
      restaurants: restaurants,
      comments: comments,
      getCreateTimeFromNow: getCreateTimeFromNow,
    })
  },
}
module.exports = restController
