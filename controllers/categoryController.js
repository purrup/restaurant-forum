const db = require('../models')
const { Category } = db
const adminService = require('../services/adminService')

let categoryController = {
  getCategories: (req, res) => {
    adminService.getCategories(req, res, (data) => { res.render('admin/categories', data) })
  },
  postCategory: (req, res) => {
    adminService.postCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },
  putCategory: (req, res) => {
    adminService.putCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },
  deleteCategory: (req, res) => {
    adminService.deleteCategory(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect('/admin/categories')
    })
  },
}
module.exports = categoryController
