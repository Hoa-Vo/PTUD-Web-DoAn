const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.get("/", orderController.renderOrderPage);

module.exports = router;
