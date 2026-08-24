const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.post("/", async (req, res) => {
    try {
        const { SupplierName, ContactNumber } = req.body;

        const [result] = await pool.query(
            "INSERT INTO suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
            [SupplierName, ContactNumber]
        );
        res.status(201).json({
            message: "Supplier created successfully",
            SupplierID: result.insertId
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});
router.get("/", async (req, res) => {
    try {
        const [rows] = await pool.query(
            "SELECT * FROM suppliers"
        );

        res.json(rows);


    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});



router.put("/:id", async (req, res) => {
    try {
        const { SupplierName, ContactNumber } = req.body;
        const { id } = req.params;

        const [result] = await pool.query(
            "UPDATE suppliers SET SupplierName = ?, ContactNumber = ? WHERE SupplierID = ?",
            [SupplierName, ContactNumber, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Supplier not found"
            });
        }

        res.json({
            message: "Supplier updated successfully"
        });

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query(
            "DELETE FROM suppliers WHERE SupplierID = ?",
            [id]
        );
        if (result.affectedRows === 0) {
            return res.status(404).json({
                error: "Supplier not found"
            });
        }
        res.json({
            message: "Supplier deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});


module.exports = router;