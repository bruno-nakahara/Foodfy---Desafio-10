const db = require('../../config/db')

module.exports = {
    create(data) {
        const query = `
            INSERT INTO recipes (
                title,  
                ingredients, 
                preparation, 
                information,
                chef_id,
                user_id
            ) VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id
        `
        const values = [
            data.name,
            data.ingredients,
            data.step,
            data.recipeInfo,
            data.chef_id,
            data.user_id
        ]

        return db.query(query, values)

    },
    chefOptions() {
        return db.query(`SELECT name, id FROM chefs`)
    },
    all() {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef 
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            ORDER BY recipes.created_at DESC`)

    },
    find(id) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.id = $1`, [id])
    },
    update(data) {
        const query = `
            UPDATE recipes SET
            title=($1), 
            ingredients=($2), 
            preparation=($3), 
            information=($4),
            chef_id=($5)
        WHERE id = ($6)
        RETURNING id`

        const values = [
            data.title,
            data.ingredients,
            data.step,
            data.recipeInfo,
            data.chef_id,
            data.id
        ]

        return db.query(query, values)
    },
    delete(id) {
        return db.query(`DELETE FROM recipes WHERE id = $1`, [id])
    },
    allFiles(id) {
        return db.query(`SELECT recipe_files.*, files.name AS file_name, files.path AS file_path
         FROM recipe_files 
         LEFT JOIN files ON (recipe_files.file_id = files.id)
         WHERE recipe_files.recipe_id = $1`, [id])
    },
    byUserId(id) {
        return db.query(`
        SELECT recipes.*, chefs.name AS chef 
        FROM recipes
        LEFT JOIN chefs ON (chefs.id = recipes.chef_id) 
        WHERE recipes.user_id = $1`, [id])
    },
    deleteByUserId(id) {
        return db.query(`DELETE FROM recipes WHERE user_id = $1`, [id])
    }
}