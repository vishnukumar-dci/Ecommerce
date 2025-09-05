const pool = require('../config/db')

async function create(name,email,password) {
    try {
        const [row] = await pool.query("INSERT INTO customer (name,email,passwords) VALUES (?,?,?)",[
            name,email,password
        ])

        if(!row.affectedRows){
            const error = new Error("Failed to add new customer")
            error.statusCode = 400
            throw error
        }

        return row
    } catch (error) {
        error.message = error.message || 'Database error while registering a user '
        throw error
    }
}

async function findById(id) {
    try {
        const [row] = await pool.query("SELECT * FROM customer WHERE id = ?",[id])
        return row
    } catch (error) {
        error.message = error.message || 'Database error while Finding customer by Id'
        throw error
    }
}

async function findByEmail(email) {
    try {
        const [row] = await pool.query("SELECT * FROM customer WHERE email = ?",[email])
        return row
    } catch (error) {
        error.message = error.message || 'Database error while Finding customer by Email'
        throw error
    }
}

async function update(id,name) {
    try {
        const [row] = await pool.query("UPDATE customer SET name = ? WHERE id = ?",[name,id])
   
        if(!row.affectedRows){
            const error = new Error("customer not found for update")
            error.statusCode = 404
            throw error
        }
        return row;
    } catch (error) {
        error.message = error.message || 'Database error while creating cart'
        throw error
    }
}

async function updateWithImage(id,name,imagepath) {
    try {
        const [row] = await pool.query("UPDATE customer SET name = ?,image_path = ? WHERE id = ?",[name,imagepath,id])
        return row
    } catch (error) {
        error.message = error.message || 'Database error while creating cart'
        throw error
    }
}

module.exports = {
    create,
    update,
    findByEmail,
    findById,
    updateWithImage
}