const User = require("../models/user")
const Recipe = require("../models/recipe")
const File = require("../models/file")
const RecipeFiles = require('../models/recipe-files')
const generator = require('generate-password')
const mailer = require('../../lib/mailer')

module.exports = {
    create(req, res) {
        return res.render("admin/user/register")
    },
    async post(req, res) {
        try {
            const password = generator.generate({
                numbers: true
            })
            
            //Verificar is_admin
            let userData = {...req.body, password}
            if (!req.body.is_admin) {
                userData = {
                    ...userData,
                    is_admin: "false"
                }
            }

            await User.create(userData)
            
            await mailer.sendMail({
                to: userData.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Conta do Usuário',
                html: `<h2>Nova conta criada!</h2>
                <p>Clique no link abaixo para acessar sua conta ${userData.name}</p>
                <p>Senha: ${password}</p>
                <p>
                    <a href="http://localhost:5000/admin/users/login" target="_blank">
                        Acesse a sua conta!
                    </a>
                </p>
                `,
            })

            return res.render("admin/user/register", {
                success: "Conta criada com sucesso!"
            })

        } catch (err) {
            console.error(err)
            return res.render("admin/user/register", {
                user: req.body,
                error: "Erro ao cadastrar!"
            })
        }
    },
    async list(req, res) {
        try {
            const users = await User.allUsers()

            return res.render("admin/user/list", { users })
        }catch(err) {
            console.error(err)
        }
    },
    async edit(req, res) {
        try {
            const user = await User.find(req.params.id)
            let userData = false

            if (req.session.admin == true && user.id == req.session.userId) {
                userData = true
            }

            if (userData) {
                return res.render("admin/profile/profile", { user } )
            }

            return res.render("admin/user/edit", { user } )
        }catch(err) {
            console.error(err)
        }
        
    },
    async put(req, res) {
        try {
            const { user } = req
            const results = await User.update(user.id, req.body)

            const userUpdated = await User.find(user.id)

            return res.render("admin/user/edit", {
                user: userUpdated,
                success: "Conta atualizada com sucesso!"
            })

        } catch (err) {
            console.error(err)
            return res.render(`admin/user/edit`, {
                user: req.body,
                error: "Erro ao atualizar!"
            })
        }
    },
    async delete(req, res) {
        try {
            let results = await Recipe.byUserId(req.body.id)
            const recipes = results.rows.map(async recipe => {
                let findRecipeFiles = await RecipeFiles.findFiles(recipe.id)
                const filesId = findRecipeFiles.rows.map(file => {
                        File.delete(file.file_id)
                })
                await Promise.all(filesId)
                await RecipeFiles.delete(recipe.id)
            })
            await Promise.all(recipes)

            await Recipe.deleteByUserId(req.body.id)

            await User.delete(req.body.id)

            return res.render("admin/user/register", {
                success: "Conta deletada com sucesso!"
            })

        }catch(err) {
            req.flash('error', "Erro inesperado ao deletar!")
            return res.redirect("/admin/users") 
        }
    }
}