
const User = require("../models/user")

module.exports = {
    async index(req, res) {
        try {
            const user = await User.find(req.session.userId)

            return res.render("admin/profile/profile", { user })
        }catch(err) {
            console.error(err)
        }
    },
    async put(req, res) {
        try {
            const {  name, email, id } = req.body

            await User.update(id, { name, email })

            const userUpdated = await User.find(id)

            return res.render("admin/profile/profile", {
                user: userUpdated,
                success: "Conta atualizada com sucesso!"
            })
        }catch(err) {
            console.error(err)
            return res.render(`admin/profile/profile`, {
                user: req.body,
                error: "Erro ao atualizar!"
            })
        }
    }
}