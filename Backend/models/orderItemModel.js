const pool = require('../config/db')

async function create(orderId,productId,qty) {
    try {
        const [row] = await pool.query("INSERT INTO order_items(order_id,product_id,qty) VALUES (?,?,?)",
            [orderId,productId,qty]
        )

        if(!row.affectedRows){
            const error = new Error('Failed to add new Order')
            error.statusCode = 400
            throw error;
        }
        return row;
    } catch (error) {
        error.message = error.message || 'Database error while creating cart'
        throw error
    }

}

async function getById(userId,orderId) {
    try {
        const [rows] = await pool.query("",
            [userId,orderId]
        )

        // if(!rows.length){
        //     const error = new Error("order details Not found for the Id")
        //     error.statusCode = 404
        //     throw error;
        // }
        
        return rows;
    } catch (error) {
        error.message = error.message || 'Database error while getting Order details by Id'
        throw error
    }
}

async function getByOrder(orderId) {
    try {
        const [rows] = await pool.query(
            `SELECT oi.id as order_item_id, oi.order_id, oi.product_id, oi.qty, p.amount as price, p.product_name
             FROM order_items oi
             LEFT JOIN products p ON p.id = oi.product_id
             WHERE oi.order_id = ?`,
            [orderId]
        )
        return rows
    } catch (error) {
        error.message = error.message || 'Database error while fetching order items'
        throw error
    }
}

async function findByOrderId(orderId) {
    try {
        const [rows] = await pool.query(`SELECT * FROM order_items WHERE order_id = ?`,[orderId])
        return rows
    } catch (error) {
        error.message = error.message || 'Database error while fetching order items'
        throw error
    }
}

async function updateStatus(orderId,productId,status) {
    try {
        const [rows] = await pool.query(`UPDATE order_items SET payment_status = ? WHERE order_id = ? AND product_id = ?`,[status,orderId,productId])
    } catch (error) {
        error.message = error.message || 'Database error while fetching order items'
        throw error
    }
}

module.exports = {
    create,
    getById,
    getByOrder,
    findByOrderId,
    updateStatus
}