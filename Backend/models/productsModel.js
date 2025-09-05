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

async function getAllById(userId,limit,offset) {
    try {
        const [rows] = await pool.query(
            `SELECT 
                p.id,
                p.product_name,
                p.descriptions,
                p.amount,
                p.image_path,    
                CASE 
                    WHEN c.id IS NOT NULL THEN 1 ELSE 0 END AS in_cart
             FROM products p 
             LEFT JOIN cart c 
             ON c.product_id = p.id AND c.user_id = ?
             ORDER BY p.id LIMIT ? OFFSET ?`
        ,[userId,limit,offset])
        return rows
    } catch (error) {
        error.message = error.message || 'Database error while getting products'
        throw error
    }
}

async function getById(id) {
    try {
        const [row] = await pool.query("SELECT * FROM products WHERE id = ?",[id])

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
        error.message = error.message || 'Database error while Updating product with image'
        throw error
    }
}

async function imageRetreive() {
    try {
        const [rows] = await pool.query("SELECT * FROM products order by id desc limit 8")
        return rows;
    } catch (error) {
        error.message = error.message || 'Database error while Updating product with image'
        throw error
    }
}

async function count(params) {
    try {
        const [row] = await pool.query(`SELECT COUNT(*) as total FROM products`)
        return row
    } catch (error) {
        error.message = error.message || 'Database error while Updating product with image'
        throw error
    }
}

module.exports = {
    create,
    getById,
    update,
    updateWithImage,
    deleteById,
    imageRetreive,
    getAllById,
    count
}