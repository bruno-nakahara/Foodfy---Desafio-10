const db = require("../../config/db")

module.exports = {
    all() {
        return db.query(`
        SELECT  chefs.*, ( SELECT count(*)  From recipes WHERE chefs.id = recipes.chef_id) AS total
        FROM chefs
        LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
        `)
    },
    findBy(filter) {
        return db.query(`
            SELECT recipes.*, chefs.name AS chef
            FROM recipes
            LEFT JOIN chefs ON (chefs.id = recipes.chef_id)
            WHERE recipes.title ILIKE '%${filter}%'
            ORDER BY recipes.updated_at DESC
        `)
    }
}