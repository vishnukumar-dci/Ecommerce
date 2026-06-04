require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const customerRoute = require("./routes/customerRoute");
const orderRoute = require("./routes/ordersRoute");
const productRoute = require("./routes/productRoute");
const cartRoute = require("./routes/cartRoute");
const errorHandler = require("./middleware/errorHandler");
const app = express();
const PORT = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/customer", customerRoute);
app.use("/order", orderRoute);
app.use("/product", productRoute);
app.use("/cart", cartRoute);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
