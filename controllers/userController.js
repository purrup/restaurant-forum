const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const imgur = require('imgur-node-api')
const uniqBy = require('lodash.uniqby')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID
const User = db.User
const Comment = db.Comment
const Restaurant = db.Restaurant

let userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm unique user
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        req.flash('error_messages', '信箱已經註冊過！')
        res.redirect('/signup')
      } else {
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
          isAdmin: false,
        }).then(user => {
          req.flash('success_messages', '成功註冊帳號！')
          res.redirect('/signin')
        })
      }
    })
  },

  signInPage: (req, res) => {
    return res.render('signin')
  },

  signIn: (req, res) => {
    req.flash('success_messages', '成功登入！')
    res.redirect('/restaurants')
  },

  logout: (req, res) => {
    req.flash('success_messages', '登出成功！')
    req.logout()
    res.redirect('/signin')
  },

  getUser: (req, res) => {
    //透過userId找到對應的comments，再把Restaurant include進comments
    return User.findByPk(req.params.id, {
      include: [{ model: Comment, include: [Restaurant] }],
    }).then(user => {
      let restaurants = []
      // 把每個Restaurant放進restaurants這個arr以便前端存取
      user.Comments.forEach(comment => {
        restaurants.push(comment.Restaurant)
      })
      //建立set容器
      const set = new Set()
      //如果item.id沒有在set裡(true)，就加進set裡，且filter會把return true的內容（也就是restaurant）回傳進results
      const results = restaurants.filter(item =>
        !set.has(item.id) ? set.add(item.id) : false
      )
      return res.render('user', {
        profile: user,
        restaurants: results,
      })
    })
  },
  editUser: (req, res) => {
    User.findByPk(req.params.id).then(user => {
      return res.render('editUser', { profile: user })
    })
  },

  putUser: (req, res) => {
    if (!req.body.name) {
      req.flash('error_messages', "name didn't exist")
      return res.redirect('back')
    } else if (Number(req.params.id) !== req.user.id) {
      req.flash(
        'error_messages',
        "Sorry, you are not allowed to edit other's profile."
      )
      return res.redirect('back')
    }
    const { file } = req
    if (file) {
      imgur.setClientID(IMGUR_CLIENT_ID)
      imgur.upload(file.path, (err, img) => {
        return User.findByPk(req.params.id).then(user => {
          user
            .update({
              name: req.body.name,
              image: file ? img.data.link : user.image,
            })
            .then(user => {
              req.flash('success_messages', 'user was successfully to update')
              res.redirect(`/users/${req.params.id}`)
            })
        })
      })
    } else {
      return User.findByPk(req.params.id).then(user => {
        user
          .update({
            name: req.body.name,
            image: file ? img.data.link : user.image,
          })
          .then(user => {
            req.flash('success_messages', 'user was successfully to update')
            res.redirect(`/users/${req.params.id}`)
          })
      })
    }
  },
}

module.exports = userController
