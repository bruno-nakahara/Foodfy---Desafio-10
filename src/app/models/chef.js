const db = require("../../config/db")
const { date } = require("../../lib/utils")

module.exports = {
    create(data, fileId) {
        const query = `
            INSERT INTO chefs (
                name,
                file_id 
            ) VALUES ($1, $2)
            RETURNING id
        `
        const values = [
            data.name,
            fileId
        ]

        return db.query(query, values)
    },
    all() {
        return db.query(`SELECT * FROM chefs`)
    },
    update(data) {
        
        const query = `
        INSERT INTO chefs (
            name,
            file_id 
        ) VALUES ($1, $2)
        `

        const values = [
            data.name,
            data.file_id
        ]

        return db.query(query, values)
          
    },
    delete(id) {
        return db.query(`DELETE FROM chefs WHERE id = $1`, [id])
    },
    find(id) {

        return db.query(`
            SELECT  chefs.*, ( SELECT count(*)  From recipes WHERE chefs.id = recipes.chef_id) AS total
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1`, [id])
    },
    recipe(id) {
        return db.query(`SELECT  * FROM recipes WHERE recipes.chef_id = $1 ORDER BY recipes.created_at DESC`, [id])
    },
    countRecipes(id) {
        return db.query(`
            SELECT  chefs.*, ( SELECT count(*)  From recipes WHERE chefs.id = recipes.chef_id) AS total
            FROM chefs
            LEFT JOIN recipes ON (chefs.id = recipes.chef_id)
            WHERE chefs.id = $1`, [id])
    },
    files(id) {
        return db.query(`SELECT * FROM files WHERE id = $1`, [id])
    }
}