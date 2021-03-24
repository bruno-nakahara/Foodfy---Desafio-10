const express = require('express')
const routes = express.Router()
const recipesController = require('../app/controllers/recipes')
const multer = require('../app/middlewares/multer')
const { onlyUsers } = require("../app/middlewares/session")
const recipesValidator = require("../app/validators/recipes")

routes.get("/", onlyUsers, recipesController.index)

routes.get("/index", onlyUsers, recipesController.index)

routes.get("/create", onlyUsers, recipesController.cheflist)

routes.post("/", onlyUsers, recipesValidator.post, multer.array("photos", 5), recipesController.post)

routes.get("/:id", onlyUsers, recipesController.show)

routes.get("/:id/edit", onlyUsers, recipesController.edit)

routes.put("/", onlyUsers, multer.array("photos", 5), recipesController.put)

routes.delete("/", onlyUsers, recipesController.delete)

module.exports = routes