const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

// 1. Add Category column
router.post("/add-category", async (req, res) => {
    try {
        await pool.query(
            "ALTER TABLE products ADD COLUMN Category VARCHAR(100)"
        );

        res.json({
            message: "Category column added successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// 2. Remove Category column
router.delete("/remove-category", async (req, res) => {
    try {
        await pool.query(
            "ALTER TABLE products DROP COLUMN Category"
        );

        res.json({
            message: "Category column removed successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// 3. Change ContactNumber to VARCHAR(15)
router.put("/change-contact-number", async (req, res) => {
    try {
        await pool.query(
            "ALTER TABLE suppliers MODIFY COLUMN ContactNumber VARCHAR(15) NOT NULL"
        );

        res.json({
            message: "ContactNumber changed to VARCHAR(15) successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


// 4. Add NOT NULL constraint to ProductName
router.put("/product-name-not-null", async (req, res) => {
    try {
        await pool.query(
            "ALTER TABLE products MODIFY COLUMN ProductName VARCHAR(100) NOT NULL"
        );

        res.json({
            message: "ProductName is now NOT NULL"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
module.exports = router;