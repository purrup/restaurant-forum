const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const User = db.User
let message = { error: '', success: '' }

let userController = {
  signUpPage: (req, res) => {
    return res.render('signup')
  },

  signUp: (req, res) => {
    // confirm unique user
    User.findOne({ where: { email: req.body.email } }).then(user => {
      if (user) {
        message.error = '信箱已經註冊過！'
        console.log(message)
        req.flash('error_messages', '信箱已經註冊過！')
        res.send({ msg: '信箱已經註冊過！' })
      } else {
        User.create({
          name: req.body.name,
          email: req.body.email,
          password: bcrypt.hashSync(
            req.body.password,
            bcrypt.genSaltSync(10),
            null
          ),
        }).then(user => {
          req.flash('success_messages', '成功註冊帳號！')
          message.success = '成功註冊帳號！'
          return res.redirect('/signin')
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
}

module.exports = userController
