// orderRouter.js
const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
  updateOrderStatus,
  getAllOrders,
} = require('../controllers/orderController');
const authenticateToken = require('../middleware/authMiddleware');
const validateRole = require('../middleware/validateRole');


// Create an order
router.post('/', authenticateToken, validateRole(['USER','SHOP_OWNER','ADMIN']), createOrder);

// Get all orders for the user
router.get('/', authenticateToken, validateRole(['USER','SHOP_OWNER','ADMIN']), getOrders);

// Get all orders (Admin only)
router.get('/all', authenticateToken, validateRole(['SHOP_OWNER','ADMIN']), getAllOrders);

// Get an order by ID
router.get('/:id', authenticateToken, validateRole(['USER','SHOP_OWNER','ADMIN']), getOrderById);

// Update an order (for Users)
router.put('/:id', authenticateToken, validateRole(['USER','SHOP_OWNER','ADMIN']), updateOrder);

// Delete an order (for Users)
router.delete('/:id', authenticateToken, validateRole(['USER','SHOP_OWNER','ADMIN']), deleteOrder);


// Update order status (Admin only)
router.patch('/:id', authenticateToken, validateRole(['ADMIN']), updateOrderStatus);



module.exports = router;