const db = require('../../config/db')
const fs = require('fs')

module.exports = {
    create({ filename, path }) {
        try {
            const query = `
                INSERT INTO files (
                    name,
                    path
                ) VALUES ($1, $2)
                RETURNING id
            `

            const values = [
                filename,
                path
            ]

            return db.query(query, values)
        } catch (err) {
            console.log(err)
        }
    },
    async delete(id) {
        try {
            const results = await db.query(`SELECT * FROM files WHERE id = $1`, [id])
            const file = results.rows[0]

            fs.unlinkSync(file.path)
        } catch (err) {
            console.log(err)
        }

        return db.query(`DELETE FROM files WHERE id = $1`, [id])
    }
}