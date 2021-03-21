const Chef = require("../models/chef")
const File = require("../models/file")
const Recipe = require("../models/recipe")

module.exports = {
    async post(req, res) {

        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == '') {
                return res.send("Please, fill all the fields")
            }
        }

        if (req.files.length == 0)
            return res.send('Please, send at least one image!')

        try {
            let results = await File.create(...req.files)
            const fileId = results.rows[0].id
            results = await Chef.create(req.body, fileId)
            chefId = results.rows[0].id
            return res.redirect(`/admin/chefs/${chefId}/edit`)

        } catch (err) {
            console.log(err)
        }

    },
    create(req, res) {
        return res.render('admin/chefs/create')
    },
    async show(req, res) {
        try {
            let chefsData = []
            const results = await Chef.all()
            const chefs = results.rows.map(async chef => {
                const chefFile = await Chef.files(chef.file_id)
                const file = chefFile.rows[0]
                chef = {
                    ...chef,
                    src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`,
                }
                return chefsData.push({
                    ...chef,
                })

            })
            await Promise.all(chefs)

            if (!chefs) return res.send('Chefs not found!')

            return res.render('admin/chefs/show', { chefs: chefsData })

        } catch (err) {
            console.log(err)
        }
    },
    async detail(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            let chef = results.rows[0]

            let recipesData = []
            results = await Chef.recipe(req.params.id)
            const items = results.rows.map(async recipe => {
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
            await Promise.all(items)

            results = await Chef.files(chef.file_id)
            const file = results.rows[0]
            chef = {
                ...chef,
                src: `${req.protocol}://${req.headers.host}${file.path.replace("public", "")}`,
            }

            return res.render('admin/chefs/chef', { items: recipesData, chef })
        } catch (err) {
            console.log(err)
        }
    },
    async edit(req, res) {
        try {
            let results = await Chef.find(req.params.id)
            const chef = results.rows[0]

            if (!chef) return res.send("Chef not found!")

            results = await Chef.files(chef.file_id)
            let files = results.rows[0]
            files = {
                ...files,
                src: `${req.protocol}://${req.headers.host}${files.path.replace("public", "")}`
            }

            return res.render('admin/chefs/edit', { chef, files })

        } catch (err) {
            console.log(err)
        }
    },
    async update(req, res) {

        try {
            const keys = Object.keys(req.body)

            for (key of keys) {
                if (req.body[key] == '' && key != "removed_files") {
                    return res.send("Please, fill all the fields")
                }
            }

            if (req.body.removed_files) {
                const removeFiles = req.body.removed_files.split(",")
                const lastIndex = removeFiles.length - 1
                removeFiles.splice(lastIndex, 1)
                await File.delete(removeFiles[0])
            }

            if (req.files.length == 0)
                return res.send('Please, send at least one image!')

            let results = await File.create({ ...req.files[0] })
            let fileId = results.rows[0].id
            
            await Chef.update({
                ...req.body, 
                file_id: fileId
            })
            
            return res.redirect(`/admin/chefs/show`)

        } catch (err) {
            console.log(err)
        }
    },
    async delete(req, res) {
        try {
            let results = await Chef.countRecipes(req.body.id)
            const count = results.rows[0]

            if (count.total != '0') {
                return res.send("Não é possível deletar")
            } else {
                let results = await Chef.find(req.body.id)
                const chef = results.rows[0]

                await File.delete(chef.file_id)

                await Chef.delete(req.body.id)

                return res.redirect('/admin/chefs/show')
            }
        } catch (err) {
            console.log(err)
        }

    }
}