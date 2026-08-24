const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.get("/total-sold", async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                p.ProductID,
                p.ProductName,
                COALESCE(SUM(s.QuantitySold), 0) AS TotalQuantitySold
            FROM products p
            LEFT JOIN sales s 
                ON p.ProductID = s.ProductID
            GROUP BY p.ProductID, p.ProductName
            ORDER BY p.ProductID
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});
router.get("/highest-stock", async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                ProductID,
                ProductName,
                StockQuantity
            FROM products
            WHERE StockQuantity = (
                SELECT MAX(StockQuantity)
                FROM products
            )
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});
router.get("/suppliers-starting-f", async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                SupplierID,
                SupplierName,
                ContactNumber
            FROM suppliers
            WHERE SupplierName LIKE 'F%'
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});
router.get("/never-sold", async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT 
                p.ProductID,
                p.ProductName,
                p.Price,
                p.StockQuantity,
                p.SupplierID
            FROM products p
            LEFT JOIN sales s
                ON p.ProductID = s.ProductID
            WHERE s.ProductID IS NULL
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});
router.get("/sales-report", async (req, res) => {
    try {
        const [rows] = await pool.execute(`
            SELECT
                p.ProductName,
                s.QuantitySold,
                s.SaleDate
            FROM sales s
            INNER JOIN products p
                ON s.ProductID = p.ProductID
            ORDER BY s.SaleID
        `);
        res.status(200).json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;