const express = require('express')
const routes = express.Router()
const chefsControllers = require('../app/controllers/chefs')
const multer = require('../app/middlewares/multer')

routes.get("/create", chefsControllers.create)

routes.post("/", multer.array("photos", 1), chefsControllers.post)

routes.get("/show", chefsControllers.show)

routes.get("/:id", chefsControllers.detail)

routes.get("/:id/edit", chefsControllers.edit)

routes.put("/", multer.array("photos", 1), chefsControllers.update)

routes.delete("/", chefsControllers.delete)

module.exports = routes