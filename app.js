const express = require('express')
const app = express()
const db = require('./models')
const port = process.env.PORT || 3000
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const bodyParser = require('body-parser')
const flash = require('connect-flash')
const session = require('express-session')
const path = require('path')
const passport = require('./config/passport')
const methodOverride = require('method-override')

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/upload', express.static(path.join(__dirname, 'upload')))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'pug')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }))
app.use(flash())
app.use(passport.initialize())
app.use(passport.session())
app.use((req, res, next) => {
  res.locals.success_messages = req.flash('success_messages')
  res.locals.error_messages = req.flash('error_messages')
  res.locals.user = req.user
  res.locals.isAuthenticated = req.isAuthenticated()
  next()
})

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`APP is listening on port ${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app, passport)
