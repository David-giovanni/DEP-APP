const express = require("express");
const router = express.Router();
const adController = require("../controllers/adController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/getAds", adController.getAds);
router.post("/postAd", authenticateToken, adController.postAd);
router.delete("/deleteAd/:adId", authenticateToken, adController.deleteAd);

module.exports = router;
