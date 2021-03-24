const User = require("../models/user")
const { compare } = require("bcryptjs")

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "") {
            return {
                user: body,
                error: 'Preencha todos os campos'
            }
        }
    }
}

async function update(req, res, next) {
    const {  password, id } = req.body

    const fillAllFields = checkAllFields(req.body)
    if (fillAllFields) {
        return res.render('admin/profile/profile', fillAllFields)
    }

    const user = await User.find(id)
    const passed = await compare(password, user.password)

    if (!passed) return res.render("admin/profile/profile", {
        user: req.body,
        error: "Senha incorreta."
    })

    next()
}

module.exports = {
    update
}