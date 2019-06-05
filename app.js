const express = require('express')
const app = express()
const port = 3000
const handlebars = require('express-handlebars')

app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

app.listen(port, () => {
  console.log(`APP is listening on port ${port}`)
})
