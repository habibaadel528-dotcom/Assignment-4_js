const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// Record a sale
router.post("/", async (req, res) => {
    try {
        const { ProductID, QuantitySold, SaleDate } = req.body;

        const [result] = await pool.query(
            "INSERT INTO sales (ProductID, QuantitySold, SaleDate) VALUES (?, ?, ?)",
            [ProductID, QuantitySold, SaleDate]
        );

        res.status(201).json({
            message: "Sale recorded successfully",
            SaleID: result.insertId
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// Retrieve all sales
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM sales"
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// Retrieve sales for a specific product
router.get("/product/:productId", async (req, res) => {
    try {
        const { productId } = req.params;

        const [rows] = await pool.query(
            "SELECT * FROM sales WHERE ProductID = ?",
            [productId]
        );

        res.json(rows);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;