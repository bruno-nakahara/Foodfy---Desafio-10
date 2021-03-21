const express = require('express')
const routes = express.Router()
const recipesController = require('../app/controllers/recipes')
const multer = require('../app/middlewares/multer')

routes.get("/", recipesController.index)

routes.get("/index", recipesController.index)

routes.get("/create", recipesController.cheflist)

routes.post("/", multer.array("photos", 5), recipesController.post)

routes.get("/:id", recipesController.show)

routes.get("/:id/edit", recipesController.edit)

routes.put("/", multer.array("photos", 5), recipesController.put)

routes.delete("/", recipesController.delete)

module.exports = routes