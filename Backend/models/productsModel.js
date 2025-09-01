const pool = require('../config/db')

async function create(name,description,price,imagePath) {
    try {
        const [row] = await pool.query("INSERT INTO products (product_name,descriptions,amount,image_path) VALUES (?,?,?,?)",[
            name,description,price,imagePath
        ])

        if(!row.affectedRows){
            const error = new Error('Failed to add a new Product')
            error.statusCode = 400
            throw error
        }
        return row.insertId
    } catch (error) {
        error.message = error.message || 'Database error while adding new product'
        throw error
    }
}

async function getAll() {
    try {
        const [rows] = await pool.query("SELECT * FROM products")
        
        return rows
    } catch (error) {
        error.message = error.message || 'Database error while getting products'
        throw error
    }
}

async function getById(id) {
    try {
        const [row] = await pool.query("SELECT * FROM products WHERE id = ?",[id])

        // if(!row.length){
        //     const error = new Error('Product not found')
        //     error.statusCode = 404
        //     throw error
        // }

        return row
    } catch (error) {
        error.message = error.message || 'Database error while getting product by Id'
        throw error 
    }
}

async function update(id,name,description,amount) {
    try {
        const[row] = await pool.query("UPDATE products SET product_name = ?,descriptions = ?,amount = ? WHERE id = ?",[
            name,description,amount,id
        ])

        if(!row.affectedRows){
            const error = new Error('Failed to update product by Id')
            error.statusCode = 404
            throw error
        }
        return row
    } catch (error) {
        error.message = error.message || 'Database error while update product by Id'
        throw error
    }
}

async function updateWithImage(id,name,description,amount,imagePath) {
    try {
        const[row] = await pool.query("UPDATE products SET product_name = ?,descriptions = ?,amount = ?,image_path = ? WHERE id = ?",[
            name,description,amount,imagePath,id
        ])

        if(!row.affectedRows){
            const error = new Error('Failed to update product by Id')
            error.statusCode = 404
            throw error
        }
        return row
    } catch (error) {
         error.message = error.message || 'Database error while Updating product with image'
        throw error
    }
}

async function deleteById(id) {
    try {
        const [row] = await pool.query("DELETE from products where id = ?",[id])

        if(!row.affectedRows){
            const error = new Error('Failed to delete product by Id')
            error.statusCode = 404
            throw error
        }
        return row;
    } catch (error) {
        throw error
    }
}

async function imageRetreive() {
    try {
        const [rows] = await pool.query("SELECT * FROM products order by id desc limit 8")
        return rows;
    } catch (error) {
        throw error
    }
}

module.exports = {create,getAll,getById,update,updateWithImage,deleteById,imageRetreive}