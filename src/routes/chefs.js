const express = require('express')
const routes = express.Router()
const chefsControllers = require('../app/controllers/chefs')
const multer = require('../app/middlewares/multer')
const { onlyUsers, chefsForAdmin } = require("../app/middlewares/session")

routes.get("/create", chefsForAdmin, chefsControllers.create)

routes.post("/", chefsForAdmin, multer.array("photos", 1), chefsControllers.post)

routes.get("/show", chefsForAdmin, chefsControllers.show)

routes.get("/users/show", onlyUsers, chefsControllers.showToUser)

routes.get("/:id", chefsForAdmin, chefsControllers.detail)

routes.get("/:id/edit", chefsForAdmin, chefsControllers.edit)

routes.put("/", chefsForAdmin, multer.array("photos", 1), chefsControllers.update)

routes.delete("/", chefsForAdmin, chefsControllers.delete)

module.exports = routes