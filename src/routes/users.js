const express = require('express')
const routes = express.Router()
const UserController = require('../app/controllers/user')
const userValidator = require("../app/validators/user")

// Rotas de perfil de um usuário logado
// routes.get('/profile', ProfileController.index) // Mostrar o formulário com dados do usuário logado
// routes.put('/profile', ProfileController.put)// Editar o usuário logado

// Rotas que o administrador irá acessar para gerenciar usuários
routes.get('/users', UserController.list) // Mostrar a lista de usuários cadastrados
routes.post('/users', userValidator.post, UserController.post) // Cadastrar um usuário
routes.get('/users/create', UserController.create) // Mostrar o formulário de criação de um usuário
routes.put('/users/:id', UserController.put) // Editar um usuário
routes.get('/users/:id/edit', UserController.edit) // Mostrar o formulário de edição de um usuário
// routes.delete('/users/:id', UserController.delete) // Deletar um usuário

module.exports = routes