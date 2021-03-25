const express = require('express')
const routes = express.Router()
const chefsControllers = require('../app/controllers/chefs')
const multer = require('../app/middlewares/multer')
const { onlyUsers, chefsForAdmin } = require("../app/middlewares/session")

routes.get("/create", onlyUsers, chefsForAdmin, chefsControllers.create)

routes.post("/", onlyUsers, chefsForAdmin, multer.array("photos", 1), chefsControllers.post)

routes.get("/show", onlyUsers, chefsForAdmin, chefsControllers.show)

routes.get("/users/show", onlyUsers, onlyUsers, chefsControllers.showToUser)

routes.get("/:id", onlyUsers, chefsForAdmin, chefsControllers.detail)

routes.get("/:id/edit", onlyUsers, chefsForAdmin, chefsControllers.edit)

routes.put("/", onlyUsers, chefsForAdmin, multer.array("photos", 1), chefsControllers.update)

routes.delete("/", onlyUsers, chefsForAdmin, chefsControllers.delete)

module.exports = routes