const User = require("../models/user")
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

            const userId = await User.create(userData)
            req.session.userId = userId
            
            await mailer.sendMail({
                to: userData.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Conta do Usuário',
                html: `<h2>Nova conta criada!</h2>
                <p>Clique no link abaixo para acessar sua conta ${userData.name}</p>
                <p>Senha: ${password}</p>
                <p>
                    <a href="http://localhost:5000/admin/users" target="_blank">
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
            
            return res.render("admin/user/edit", { user } )
        }catch(err) {
            console.error(err)
        }
        
    },
    async put(req, res) {
        try {
            const results = await User.update(req.body)

            return res.render("admin/user/list", {
                success: "Conta atualizada com sucesso!"
            })

        } catch (err) {
            console.error(err)
            return res.render("admin/user/req.body.id/edit", {
                user: req.body,
                error: "Erro ao atualizar!"
            })
        }
    }
}