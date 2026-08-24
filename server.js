const express = require("express");
const pool = require("./db/connection");
const productsRouter = require("./routes/products");
const suppliersRouter = require("./routes/suppliers");
const salesRouter = require("./routes/sales");
const modificationsRouter = require("./routes/modifications");
const initializeRouter = require("./routes/initialize");
const reportsRouter = require("./routes/reports");
const app = express();

app.use(express.json());

app.use("/api/products", productsRouter);
app.use("/api/sales", salesRouter);
app.use("/api/suppliers", suppliersRouter);
app.use("/api/modifications", modificationsRouter);
app.use("/api/initialize", initializeRouter);
app.use("/api/reports", reportsRouter);
const PORT = 3000;

app.get("/", (req, res) => {
    res.json({
        message: "Store API is running"
    });
});

app.listen(PORT, async () => {
    try {
        const connection = await pool.getConnection();

        console.log("MySQL connected successfully!");

        connection.release();

        console.log(`Server running on http://localhost:${PORT}`);

    } catch (error) {
        console.error("Database connection failed:", error.message);
    }
});