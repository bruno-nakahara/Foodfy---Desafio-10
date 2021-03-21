const db = require('../../config/db')

module.exports = {
    create(recipeId, fileId) {
        const query = `
            INSERT INTO recipe_files (
                recipe_id,
                file_id
            ) VALUES ($1, $2)
        `
        const values = [
            recipeId,
            fileId
        ]

        return db.query(query, values)
    },
    delete(recipeId) {
        return db.query(`DELETE FROM recipe_files WHERE recipe_id = $1`, [recipeId])
    },
    findFiles(recipeId) {
        return db.query(`SELECT * FROM recipe_files WHERE recipe_id = $1`, [recipeId])
    },
    deleteOldPhoto(fileId) {
        return db.query(`DELETE FROM recipe_files WHERE file_id = $1`, [fileId])
    }
}