const express = require('express')
const app = express()
const db = require('./models')
const port = 3000
const handlebars = require('express-handlebars')

app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.listen(port, () => {
  db.sequelize.sync()
  console.log(`APP is listening on port ${port}`)
})

// 引入 routes 並將 app 傳進去，讓 routes 可以用 app 這個物件來指定路由
require('./routes')(app)
