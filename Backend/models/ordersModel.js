const pool = require('../config/db')

async function create(customerId) {
    try {
        const [row] = await pool.query("INSERT INTO orders (user_id,payment_status) VALUES (?,?)", [customerId,"pending"])
        
        if(!row.affectedRows){
            const error = new Error('Faild to create order details')
            error.statusCode = 400
            throw error
        }
        
        return row
    } catch (error) {
        error.message = error.message || 'Database error while Adding order details'
        throw error
    }
}

async function update(amount,status,orderId) {
    try {
        const [row] = await pool.query("UPDATE orders SET amount = ?, payment_status = ? WHERE id = ?", [amount, status, orderId])
        if(!row.affectedRows){
            const error = new Error('Failed to update the order by Id')
            error.statusCode = 404
            throw error
        }
        return row.insertId
    } catch (error) {
        error.message = error.message || 'Database error while Updating order by Id'
        throw error
    }
}

async function getById(orderId) {
    try {
        const [rows] = await pool.query("SELECT * FROM orders WHERE id = ?", [orderId])
        return rows
    } catch (error) {
        error.message = error.message || 'Database error while getting order by Id'
        throw error
    }
}

async function userhistory(userId,limit,offset) {
    try {
      
        const [row] = await pool.query(
            `SELECT 
                    o.id,
                    o.payment_status,
                    p.product_name,
                    ot.qty,
                    p.image_path,
                    p.amount as price,
                    o.created_at 
                    FROM orders o 
                    INNER JOIN order_items ot 
                    ON ot.order_id = o.id 
                    INNER JOIN products p 
                    ON p.id = ot.product_id 
                    WHERE o.user_id = ?
                    AND o.payment_status = 'paid'
                    ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
            [userId,limit,offset])
        return row
    } catch (error) {
        error.message = error.message || 'Database error while getting history by id'
        throw error
    }
}

async function history(limit,offset) {
    try {
            const [row] = await pool.query(
                `SELECT o.id,
                        c.name,
                        o.payment_status,
                        p.product_name,
                        ot.qty,p.amount,
                        o.created_at 
                        FROM orders o 
                        INNER JOIN customer c 
                        ON o.user_id = c.id 
                        INNER JOIN order_items ot 
                        ON ot.order_id = o.id 
                        INNER JOIN products p 
                        ON p.id = ot.product_id
                        ORDER BY o.created_at DESC LIMIT ? OFFSET ?`
            ,[limit,offset])

            return row
    } catch (error) {
        error.message = error.message || 'Database error while getting history of users orders'
        throw error
    }
}

async function count() {
    try {
        const  [row] = await pool.query(
            `SELECT COUNT(*) AS total FROM orders;`
        )
        return row
    } catch (error) {
        error.message = error.message || 'Database error while getting history of users orders'
        throw error
    }
}

async function countById(userId) {
    try {
        const [row] = await pool.query("SELECT COUNT(*) AS total FROM orders WHERE user_id = ?",[userId])
        return row
    } catch (error) {
        error.message = error.message || 'Database error while getting history of users orders'
        throw error
    }
}

module.exports = {
    create,
    update,
    getById,
    userhistory,
    history,
    count,
    countById
}