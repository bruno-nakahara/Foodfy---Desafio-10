const express = require('express')
const routes = express.Router()
const UserController = require('../app/controllers/user')
const SessionController = require('../app/controllers/session')
const userValidator = require("../app/validators/user")
const SessionValidator = require('../app/validators/session')
const { onlyAdmins, isLoggedRedirectToUsers } = require("../app/middlewares/session")

//Rotas de login/logout dos usuários
routes.get('/users/login', isLoggedRedirectToUsers, SessionController.loginForm)
routes.post('/users/login', SessionValidator.login, SessionController.login)
routes.post('/users/logout',  SessionController.logout)

//Reset password / forget
routes.get('/users/forgot-password', SessionController.forgotForm)
routes.get('/users/password-reset', SessionController.resetForm)
routes.post('/users/forgot-password', SessionValidator.forgot, SessionController.forgot)
routes.post('/users/password-reset', SessionValidator.reset, SessionController.reset)

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', onlyAdmins, UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/users', onlyAdmins, userValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/users/create', onlyAdmins, UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/users/:id', onlyAdmins, userValidator.put, UserController.put) // Editar um usuário
routes.get('/users/:id/edit', onlyAdmins, UserController.edit) // Mostrar o formulário de edição de um usuário
routes.delete('/users/:id', onlyAdmins, UserController.delete) // Deletar um usuário

module.exports = routes