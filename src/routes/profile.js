const express = require('express')
const routes = express.Router()
const ProfileController = require("../app/controllers/profile")
const profileValidator = require("../app/validators/profile")
const { onlyUsers } = require("../app/middlewares/session")

// Rotas de perfil de um usuário logado
routes.get('/', onlyUsers, ProfileController.index) // Mostrar o formulário com dados do usuário logado
routes.put('/', onlyUsers, profileValidator.update, ProfileController.put)// Editar o usuário logado

module.exports = routes