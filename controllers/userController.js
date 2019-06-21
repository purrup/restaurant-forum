const bcrypt = require('bcrypt-nodejs')
const db = require('../models')
const { Favorite, Like, Restaurant, Comment, User, Followship } = db
const imgur = require('imgur-node-api')
const IMGUR_CLIENT_ID = process.env.IMGUR_CLIENT_ID

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
    console.log('user.id : ', req.user.id)
    console.log('req.params.id : ', req.params.id)
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
  addFavorite: (req, res) => {
    return Favorite.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then(restaurant => {
      return res.redirect('back')
    })
  },

  removeFavorite: (req, res) => {
    return Favorite.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    })
      .then(favorite => {
        favorite.destroy()
      })
      .then(restaurant => {
        // 此處restaurant可省略
        return res.redirect('back')
      })
  },

  addLike: (req, res) => {
    return Like.create({
      UserId: req.user.id,
      RestaurantId: req.params.restaurantId,
    }).then(() => res.redirect('back'))
  },

  removeLike: async (req, res) => {
    const like = await Like.findOne({
      where: {
        UserId: req.user.id,
        RestaurantId: req.params.restaurantId,
      },
    })
    like.destroy().then(() => res.redirect('back'))
  },
  getTopUser: (req, res) => {
    // 撈出所有 User 與 followers 資料
    return User.findAll({
      include: [{ model: User, as: 'Followers' }],
    }).then(users => {
      // 整理 users 資料
      users = users.map(user => ({
        ...user.dataValues,
        // 計算追蹤者人數
        FollowerCount: user.Followers.length,
        // 判斷目前登入使用者是否已追蹤該 User 物件
        isFollowed: req.user.Followings.map(d => d.id).includes(user.id),
      }))
      // 依追蹤者人數排序清單
      users = users.sort((a, b) => b.FollowerCount - a.FollowerCount)
      return res.render('topUser', { users: users })
    })
  },
  addFollowing: (req, res) => {
    if (Number(req.params.userId) === req.user.id) {
      req.flash('error_messages', 'Sorry, 不能追蹤自己喔')
      return res.redirect('back')
    }
    Followship.create({
      followerId: req.user.id,
      followingId: req.params.userId,
    }).then(followship => {
      return res.redirect('back')
    })
  },

  removeFollowing: async (req, res) => {
    const followship = await Followship.findOne({
      where: {
        followerId: req.user.id,
        followingId: req.params.userId,
      },
    })
    followship.destroy().then(() => res.redirect('back'))
  },
}

module.exports = userController
