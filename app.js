const express = require('express')
const app = express()
const db = require('./models')
const port = 3000
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('./config/passport')

app.use('/', express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

app.use(passport.initialize())
app.use(passport.session())

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`APP is listening on port ${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app, passport)
