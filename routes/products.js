const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.post("/", async (req, res) => {
    try {
        const {
            ProductName,
            Price,
            StockQuantity,
            SupplierID
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO products
            (ProductName, Price, StockQuantity, SupplierID)
            VALUES (?, ?, ?, ?)`,
            [ProductName, Price, StockQuantity, SupplierID]
        );
        res.status(201).json({
            message: "Product created successfully",
            ProductID: result.insertId
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/", async (req, res) => {
    try {
        const [products] = await pool.execute(
            "SELECT * FROM products"
        );
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});
router.put("/update-bread-price", async (req, res) => {
    try {
        const [result] = await pool.query(
            "UPDATE products SET Price = ? WHERE ProductName = ?",
            [25.00, "Bread"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Product 'Bread' not found"
            });
        }

        res.json({
            message: "Bread price updated to 25.00 successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
router.delete("/delete-eggs", async (req, res) => {
    try {
        const [result] = await pool.query(
            "DELETE FROM products WHERE ProductName = ?",
            ["Eggs"]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Product 'Eggs' not found"
            });
        }

        res.json({
            message: "Eggs product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [products] = await pool.execute(
            "SELECT * FROM products WHERE ProductID = ?",
            [id]
        );
        if (products.length === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json(products[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const {
            ProductName,
            Price,
            StockQuantity,
            SupplierID
        } = req.body;
        const [result] = await pool.execute(
            `UPDATE products
            SET ProductName = ?,
                Price = ?,
                StockQuantity = ?,
                SupplierID = ?
            WHERE ProductID = ?`,
            [
                ProductName,
                Price,
                StockQuantity,
                SupplierID,
                id
            ]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product updated successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.execute(
            "DELETE FROM products WHERE ProductID = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;