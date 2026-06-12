const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/auth");
const { chatWithFinora } = require("../controllers/chatController");

router.post("/", protect, chatWithFinora);

module.exports = router;