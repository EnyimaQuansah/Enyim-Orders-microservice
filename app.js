// app.js
require('dotenv').config();
const express = require("express");
const { connectRabbitMQ } = require("./config/rabbitmq");
const orderRouter = require("./routes/orderRouter");
const productRouter = require("./routes/productRouter");
const { connectOrderDB } = require("./config/db");
const { consumeProductEvents } = require("./events/consumeProductEvents");
const syncProductCache = require("./services/productCacheSyncService");
const { initializeAndSyncProducts } = require('./services/elasticsearchSync');
const imageRouter = require('./routes/imageRoutes');

const app = express();
app.use(express.json());


(async () => {
  try {
    // Connect to the main Order DB
    await connectOrderDB();

    // Start ProductCache Sync Service
    await syncProductCache();

    await connectRabbitMQ();

    // Initialize and sync Elasticsearch
    await initializeAndSyncProducts().catch((error) => {
      console.error('Failed to initialize and sync Elasticsearch:', error);
    });

  } catch (err) {
    console.error("Failed to start server:", err.message);
    process.exit(1);
  }
})();


// Routes
app.use("/orders", orderRouter);
app.use("/products", productRouter);
app.use('/images', imageRouter);

// Alive check route
app.get('/activate', (req, res) => {
  res.status(200).json({ message: 'Orders service is active' });
});

module.exports = app;
