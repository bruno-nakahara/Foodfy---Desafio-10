const Recipe = require('../models/recipe')
const File = require('../models/file')
const RecipeFiles = require('../models/recipe-files')

module.exports = {
    async post(req, res) {
        try {
            if (req.files.length == 0) {
                return res.render('admin/recipes/create', {
                    user: req.body,
                    error: 'Envie pelo menos 1 foto.'
                })
            }
        
            let results = await Recipe.create({
                ...req.body,
                user_id: req.session.userId
            })
            const recipeId = results.rows[0].id

            const filesPromise = req.files.map(async file => {
                results = await File.create({ ...file })
                const fileId = results.rows[0].id

                await RecipeFiles.create(recipeId, fileId)
            })
            await Promise.all(filesPromise)

            req.flash('success', "Receita criada com sucesso!")
            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch (err) {
            console.log(err)
            return res.render("admin/recipes/create", {
                error: "Error!"
            })
        }
    },
    async index(req, res) {
        try {
            let recipesData = []
            let results = await Recipe.all()
            const recipes = results.rows.map(async recipe => {
                const recipeFile = await Recipe.allFiles(recipe.id)
                const file = recipeFile.rows[0]
                recipe = {
                    ...recipe,
                    src: `${req.protocol}://${req.headers.host}${file.file_path.replace("public", "")}`
                }
                return recipesData.push({
                    ...recipe,
                })
            })
            await Promise.all(recipes)

            return res.render("admin/recipes/index", { items: recipesData })

        } catch (err) {
            console.log(err)
        }

    },
    async show(req, res) {
        try {
            let recipeFiles = []
            let results = await Recipe.find(req.params.id)
            let recipe = results.rows[0]
            recipe = {
                ...recipe,
                information: recipe.information.replace(/\\r\\n/g, '').replace(/\\n/g, '<br />').replace(/\\/g, '')
            }

            results = await Recipe.allFiles(recipe.id)
            const files = results.rows.map(file => {
                recipeFiles.push({
                    name: file.file_name,
                    src: `${req.protocol}://${req.headers.host}${file.file_path.replace("public", "")}`,
                })
            })

            return res.render("admin/recipes/show", { item: recipe, files: recipeFiles })

        } catch (err) {
            console.log(err)
        }

    },
    async edit(req, res) {
        try {
            let results = await Recipe.find(req.params.id)
            const recipe = results.rows[0]

            let recipeFiles = []
            results = await Recipe.allFiles(recipe.id)
            const files = results.rows.map(file => {
                recipeFiles.push({
                    id: file.file_id,
                    name: file.file_name,
                    src: `${req.protocol}://${req.headers.host}${file.file_path.replace("public", "")}`,
                })
            })

            results = await Recipe.chefOptions()
            const options = results.rows

            return res.render("admin/recipes/edit", { item: recipe, chefsOptions: options, files: recipeFiles })

        } catch (err) {
            console.log(err)
        }
    },
    async put(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "" && key != "removed_files" && key != "recipeInfo") {
                return res.send('Please, fill all the fields')
            }
        }

        try {
            let results = await Recipe.allFiles(req.body.id)
            const countFiles = results.rows.length

            if (req.body.removed_files) {
                const removeFiles = req.body.removed_files.split(",")
                const lastIndex = removeFiles.length - 1
                removeFiles.splice(lastIndex, 1)
                if (removeFiles.length == countFiles) {
                    if (req.files.length == 0) {
                        return res.send('Please, send at least one image!')
                    }
                }
                const removedFilesPromise = removeFiles.map(id => {
                    File.delete(id)
                    RecipeFiles.deleteOldPhoto(id)
                })
                await Promise.all(removedFilesPromise)

            }

            results = await Recipe.update(req.body)
            const recipeId = results.rows[0].id

            const filesPromise = req.files.map(async file => {
                results = await File.create({ ...file })
                const fileId = results.rows[0].id

                await RecipeFiles.create(recipeId, fileId)
            })
            await Promise.all(filesPromise)

            req.flash('success', "Receita atualizada com sucesso!")
            return res.redirect(`/admin/recipes/${recipeId}`)

        } catch (err) {
            console.log(err)
            return res.render("admin/recipes/edit", {
                error: "Error!"
            })
        }
    },
    async delete(req, res) {
        try {
            let results = await RecipeFiles.findFiles(req.body.id)
            const filesId = results.rows.map(file => {
                File.delete(file.file_id)
            })
            await Promise.all(filesId)
            await RecipeFiles.delete(req.body.id)
            await Recipe.delete(req.body.id)

            req.flash('success', "Receita deletada com sucesso!")
            return res.redirect("/admin/recipes")

        } catch (err) {
            console.error(err)
            return res.render("admin/recipes/edit", {
                error: "Error!"
            })
        }
    },
    async cheflist(req, res) {
        try {
            let results = await Recipe.chefOptions()
            const options = results.rows

            return res.render("admin/recipes/create", { chefsOptions: options })

        } catch (err) {
            console.log(err)
        }
    }
}

