const crypto = require('crypto')
const User = require("../models/user")
const Recipe = require("../models/recipe")
const mailer = require('../../lib/mailer')
const { hash } = require('bcryptjs')

module.exports = {
    loginForm(req, res) {
        return res.render('admin/session/login')
    },
    login(req, res) {
        try {
            req.session.userId = req.user.id
            req.session.admin = req.user.is_admin

            return res.redirect("/admin/profile?alert=success&message=Logado")
        } catch (err) {
            console.error(err) 
            return res.render("admin/session/login", { error: "Falha ao logar!", user: req.body })
        }
        
    },
    logout(req, res) {
        try {
            req.session.destroy()
            return res.redirect("/?alert=success&message=Logoff")
        }catch(err) {
            console.error(err)
            return res.render("admin/profile/profile", { error: "Falha Logout!" })
        }
        
    },
    forgotForm(req, res) {
        return res.render("admin/session/forgot-password")
    },
    async forgot(req, res) {
        try {
            const token = crypto.randomBytes(20).toString("hex")

            let now = new Date()
            now = now.setHours(now.getHours() + 1)

            await User.update(req.user.id, {
                reset_token: token,
                reset_token_expires: now
            })

            await mailer.sendMail({
                to: req.user.email,
                from: 'no-replay@foodfy.com.br',
                subject: 'Recuperação de senha',
                html: `<h2>Perdeu a chave?</h2>
                <p>Não se preocupe, clique no link abaixo para recuperar sua senha</p>
                <p>
                    <a href="http://localhost:5000/admin/users/password-reset?token=${token}" target="_blank">
                        RECUPERAR SENHA
                    </a>
                </p>
                `,
            })

            return res.render("admin/session/forgot-password", {
                success: "Verifique seu email para resetar sua senha!"
            })
        }catch(err) {
            console.error(err)
            return res.render("admin/session/forgot-password", {
                error: "Erro inesperado!"
            })
        }
    },
    resetForm(req, res) {
        return res.render("admin/session/password-reset", { token: req.query.token })
    },
    async reset(req, res) {
        const { password, token } = req.body
        const user = req.user

        try {
            const newPassword = await hash(password, 8)

            await User.update(user.id, {
                password: newPassword,
                reset_token: "",
                reset_token_expires: "",
            })

            return res.render("admin/session/login", {
                user: req.body,
                success: "Senha atualizada com sucesso!"
            })
        } catch (err) {
            console.error(err)
            return res.render("admin/session/password-reset", {
                user: req.body,
                token,
                error: "Erro inesperado!"
            })
        }
    }
}