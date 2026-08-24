const express = require("express");
const router = express.Router();
const pool = require("../db/connection");

router.post("/", async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        let [suppliers] = await connection.execute(
            "SELECT SupplierID FROM suppliers WHERE SupplierName = ?",
            ["FreshFoods"]
        );

        let supplierId;

        if (suppliers.length > 0) {
            supplierId = suppliers[0].SupplierID;
        } else {
            const [result] = await connection.execute(
                "INSERT INTO suppliers (SupplierName, ContactNumber) VALUES (?, ?)",
                ["FreshFoods", "01001234567"]
            );
            supplierId = result.insertId;
        }
        const products = [
            {
                name: "Milk",
                price: 15.00,
                stock: 50
            },
            {
                name: "Bread",
                price: 10.00,
                stock: 30
            },
            {
                name: "Eggs",
                price: 20.00,
                stock: 40
            }
        ];
        const productIds = {};
        for (const product of products) {

            let [existingProduct] = await connection.execute(
                "SELECT ProductID FROM products WHERE ProductName = ?",
                [product.name]
            );

            if (existingProduct.length > 0) {

                productIds[product.name] = existingProduct[0].ProductID;

            } else {

                const [result] = await connection.execute(
                    `INSERT INTO products
                    (ProductName, Price, StockQuantity, SupplierID)
                    VALUES (?, ?, ?, ?)`,
                    [
                        product.name,
                        product.price,
                        product.stock,
                        supplierId
                    ]
                );

                productIds[product.name] = result.insertId;
            }
        }
        const milkId = productIds["Milk"];
        const [existingSale] = await connection.execute(
            `SELECT SaleID
             FROM sales
             WHERE ProductID = ?
             AND QuantitySold = ?
             AND SaleDate = ?`,
            [milkId, 2, "2025-05-20"]
        );


        if (existingSale.length === 0) {

            await connection.execute(
                `INSERT INTO sales
                (ProductID, QuantitySold, SaleDate)
                VALUES (?, ?, ?)`,
                [
                    milkId,
                    2,
                    "2025-05-20"
                ]
            );
        }

        await connection.commit();
        res.status(201).json({
            supplier: {
                name: "FreshFoods",
                contactNumber: "01001234567",
                supplierId: supplierId
            },
            products: [
                {
                    name: "Milk",
                    price: 15.00,
                    stockQuantity: 50,
                    productId: productIds["Milk"]
                },
                {
                    name: "Bread",
                    price: 10.00,
                    stockQuantity: 30,
                    productId: productIds["Bread"]
                },
                {
                    name: "Eggs",
                    price: 20.00,
                    stockQuantity: 40,
                    productId: productIds["Eggs"]
                }
            ],
            sale: {
                product: "Milk",
                quantitySold: 2,
                saleDate: "2025-05-20"
            }
        });

    } catch (error) {

        await connection.rollback();

        console.error(error);

        res.status(500).json({
            error: error.message
        });

    } finally {
        connection.release();
    }
});
module.exports = router;