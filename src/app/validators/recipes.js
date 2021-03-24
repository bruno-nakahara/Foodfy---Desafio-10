

function checkAllFields(body) {
    const keys = Object.keys(body)

    for (key of keys) {
        if (body[key] == "" && key != "recipeInfo") {
            return {
                item: body,
                error: 'Preencha todos os campos'
            }
        }
    }
}

async function post(req, res, next) {

    const fillAllFields = checkAllFields(req.body)
    if(fillAllFields) {
        return res.render('admin/recipes/create', fillAllFields)
    }
    
    next()
}

module.exports = {
    post
}