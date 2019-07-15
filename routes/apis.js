const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../controllers/api/adminController.js')
const userController = require('../controllers/api/userController.js')
const passport = require('../config/passport')
const authenticated = passport.authenticate('jwt', { session: false })

const authenticatedAdmin = (req, res, next) => {
  if (req.user) {
    if (req.user.isAdmin) { return next() }
    return res.json({ status: 'error', message: 'permission denied' })
  } else {
    return res.json({ status: 'error', message: 'permission denied' })
  }
}
router.post('/signup', userController.signUp)

router.get('/admin/restaurants', authenticated, authenticatedAdmin, adminController.getRestaurants)
router.get('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.getRestaurant)
router.delete('/admin/restaurants/:id', authenticated, authenticatedAdmin, adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), authenticated, authenticatedAdmin, adminController.postRestaurant)
router.get('/admin/restaurants/:id/edit', authenticated, authenticatedAdmin,adminController.editRestaurant)
router.put('/admin/restaurants/:id',upload.single('image'), authenticated, authenticatedAdmin,adminController.putRestaurant)
router.get('/admin/categories', authenticated, authenticatedAdmin,adminController.getCategories)
router.get('/admin/categories/:id', authenticated, authenticatedAdmin, adminController.getCategories)
router.post('/admin/categories', authenticated, authenticatedAdmin,adminController.postCategory)
router.put('/admin/categories/:id', authenticated, authenticatedAdmin,adminController.putCategory)
router.delete('/admin/categories/:id', authenticated, authenticatedAdmin,adminController.deleteCategory)
// JWT signin
router.post('/signin', userController.signIn)

module.exports = router