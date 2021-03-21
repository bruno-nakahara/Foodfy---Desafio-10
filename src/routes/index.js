const express = require('express')
const routes = express.Router()
const recipes = require('./recipes')
const chefs = require('./chefs')
const users = require('./users')
const sitesControllers = require('../app/controllers/sites')

//Main
routes.get("/", sitesControllers.main)

routes.get("/main/index", sitesControllers.main)

routes.get("/main/about", function (req, res) {
    return res.render("main/about")
})

routes.get("/main/recipes", sitesControllers.all)

routes.get("/main/recipes/:id", sitesControllers.detail)

routes.get("/main/chefs", sitesControllers.allChefs)

routes.get("/main/search", sitesControllers.search)

routes.use('/admin/chefs', chefs)
routes.use('/admin/recipes', recipes)
routes.use('/admin', users)

//Error
routes.use(function (req, res) {
    res.status(404).render('main/not-found')
})

module.exports = routes