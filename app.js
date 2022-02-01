const express = require('express')
const { engine } = require('express-handlebars')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const app = express()
const admin = require('./routes/admin.js')
const path = require('path')
const session = require('express-session')
const flash = require('connect-flash')

app.use(session({
    secret: "cursodenode",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')

    next()
})

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.engine('handlebars', engine({defaultLayout: 'main'}))
app.set('view engine', 'handlebars')

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/blogapp')
    .then(() => {
        console.log('bd succes connect')
    })
    .catch((err) => {
        console.log('connect error: ' + err)
    })

app.use(express.static(path.join(__dirname, "public")))

app.use((req, res, next) => {
    console.log('hi i am a middlewhere')
    next()
})

app.use('/admin', admin)

app.listen(8081, () => {
    console.log('servidor rodando na porta 8081')
})