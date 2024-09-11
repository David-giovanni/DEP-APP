const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/googleLogin", authController.googleLogin);
router.get("/getUserInfo", authController.getUserInfo);

module.exports = router;
