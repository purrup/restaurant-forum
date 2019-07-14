const db = require('../models')
const { Category } = db
const adminService = require('../services/adminService')

let categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => { res.render('admin/categories', data) })
  },
  postCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    } else {
      return Category.create({
        name: req.body.name,
      }).then(category => {
        res.redirect('/admin/categories')
      })
    }
  },
  putCategory: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    } else {
      return Category.findByPk(req.params.id).then(category => {
        category.update(req.body).then(category => {
          res.redirect('/admin/categories')
        })
      })
    }
  },
  deleteCategory: (req, res) => {
    return Category.findByPk(req.params.id).then(category => {
      category.destroy().then(category => {
        res.redirect('/admin/categories')
      })
    })
  },
}
module.exports = categoryController
