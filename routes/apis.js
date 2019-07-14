const express = require('express')
const router = express.Router()
const multer = require('multer')
const upload = multer({ dest: 'temp/' })
const adminController = require('../controllers/api/adminController.js')
const userController = require('../controllers/api/userController.js')

router.get('/admin/restaurants', adminController.getRestaurants)
router.get('/admin/restaurants/:id', adminController.getRestaurant)
router.delete('/admin/restaurants/:id', adminController.deleteRestaurant)
router.post('/admin/restaurants', upload.single('image'), adminController.postRestaurant)
router.get('/admin/restaurants/:id/edit',adminController.editRestaurant)
router.put('/admin/restaurants/:id',upload.single('image'),adminController.putRestaurant)
router.get('/admin/categories',adminController.getCategories)
router.get('/admin/categories/:id', adminController.getCategories)
router.post('/admin/categories',adminController.postCategory)
router.put('/admin/categories/:id',adminController.putCategory)
router.delete('/admin/categories/:id',adminController.deleteCategory)
// JWT signin
router.post('/signin', userController.signIn)

module.exports = router