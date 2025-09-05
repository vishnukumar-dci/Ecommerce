const pool = require('../config/db')

async function create(userId,productId) {
    try {
        const [row] = await pool.query("INSERT INTO cart (user_id,product_id,qty) VALUES (?,?,1)",[userId,productId])
        
        if(!row.affectedRows){
            const error = new Error("Failed to add new Product in cart")
            error.statusCode = 400
            throw error
        }

        return row
    } catch (error) {
        error.message = error.message || 'Database error while creating cart'
        throw error
    }
}

async function find(userId) {
    try {
        const [row] = await pool.query("SELECT * FROM cart WHERE user_id = ? AND is_deleted = false",[userId])
        return row
    } catch (error) {
        error.message = error.message || 'Database error while Finding product by user'
        throw error
    }
}

async function findProduct(userId,productId) {
       try {
        const [row] = await pool.query("SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND is_deleted = 0",[userId,productId])
        return row
    } catch (error) {
        error.message = error.message || 'Database error while finding product in cart '
        throw error
    }
}

async function update(orderId) {
    try {
        const [row] = await pool.query("UPDATE cart SET qty = qty + 1 WHERE id = ?",[orderId])

        if(!row.affectedRows){
            const error = new Error("Cart item not found for update")
            error.statusCode = 404
            throw error
        }
        return row
    } catch (error) {
        error.message = error.message || 'Database error while updating product on cart'
        throw error
    }
}

async function deleteFromCart(orderId) {
    try {
        const [row] = await pool.query("DELETE from cart WHERE id = ?",[orderId])

        if(!row.affectedRows){
            const error = new Error("Cart item not found for Deletion")
            error.statusCode = 404
            throw error
        }
        
        return row
    } catch (error) {
        error.message = error.message || 'Database error while deleting product on cart'
        throw error
    }
}

async function getById(userId) {
    try {
        const [rows] = await pool.query("SELECT p.image_path,p.product_name,p.amount,c.product_id,c.id,c.qty FROM cart c INNER JOIN products p ON c.product_id = p.id WHERE c.user_id = ? AND c.is_deleted = 0",[userId])
        
        return rows
    } catch (error) {
        error.message = error.message ||'Database Error while getting product form cart by user'
        throw error
    }
}

async function removeFromCart(userId,productId) {
    try {
        const [row] = await pool.query("UPDATE cart SET is_deleted = 1 WHERE user_id = ? AND product_id = ?",
            [userId,productId]
        )

        if(!row.affectedRows){
            const error = new Error("Cart item not found for userId and ProductId")
            error.statusCode = 404
            throw error
        }
    } catch (error) {
        error.message = error.message || 'Database Error while deleting product from cart by user'
        throw error
    }
}

async function decrement(userId, productId) {
    try {
        const [row] = await pool.query(
            "UPDATE cart SET qty = qty - 1 WHERE user_id = ? AND product_id = ? AND is_deleted = 0 AND qty > 1",
            [userId, productId]
        )
        if (row.affectedRows) return row
        const [delRow] = await pool.query(
            "UPDATE cart SET is_deleted = 1 WHERE user_id = ? AND product_id = ? AND is_deleted = 0",
            [userId, productId]
        )
        return delRow
    } catch (error) {
        error.message = error.message || 'Database Error while decrementing product from cart by user'
        throw error
    }
}

async function clearForUser(userId) {
    try {
        const [row] = await pool.query("UPDATE cart SET is_deleted = 1 WHERE user_id = ? AND is_deleted = 0", [userId])
        return row
    } catch (error) {
        error.message = error.message || 'Database Error while clearing cart for user'
        throw error
    }
}

async function hardDeleteForUser(userId) {
    try {
        // Remove only active items that were just purchased
        const [row] = await pool.query("DELETE FROM cart WHERE user_id = ? AND is_deleted = 0", [userId])
        return row
    } catch (error) {
        error.message = error.message || 'Database Error while hard-deleting cart for user'
        throw error
    }
}

async function removeItem(userId,productId) {
    try {
        const [row] = await pool.query(`DELETE FROM cart WHERE user_id = ? AND product_id = ?`,[userId,productId])
    } catch (error) {
        error.message = error.message || 'Database Error while hard-deleting cart for user'
        throw error
    }
}

module.exports = {
    create,
    find,
    update,
    deleteFromCart,
    getById,
    findProduct,
    removeFromCart,
    decrement,
    clearForUser,
    hardDeleteForUser,
    removeItem
}