const Recipe = require('../models/recipe')
const Chef = require("../models/chef")
const Site = require("../models/site")

module.exports = {
    about(req, res) {
        return res.render("main/about")
    },
    async main(req, res) {
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

            if (recipesData.length >= 7) {
                recipesData = recipesData.slice(0, 6)
            }

            return res.render('main/index', { items: recipesData })
        } catch (err) {
            console.log(err)
        }

    },
    async all(req, res) {
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

            return res.render('main/recipes', { items: recipesData })
        } catch (err) {
            console.log(err)
        }
    },
    async detail(req, res) {
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

            return res.render("main/recipe", { item: recipe, files: recipeFiles })

        } catch (err) {
            console.log(err)
        }
    },
    async allChefs(req, res) {
        try {
            let chefsData = []
            results = await Site.all()
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

            return res.render("main/chefs", { chefs: chefsData })

        } catch (err) {
            console.log(err)
        }

    },
    async search(req, res) {
        try {
            const { filter } = req.query

            if (filter) {
                let recipesData = []
                let results = await Site.findBy(filter)
                const filteredList = results.rows.map(async recipe => {
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
                await Promise.all(filteredList)

                return res.render("main/search", { items: recipesData, filter })

            } else {
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
                console.log(recipesData)
                return res.render('main/recipes', { items: recipesData })
            }
        } catch (err) {
            console.log(err)
        }


    }
}