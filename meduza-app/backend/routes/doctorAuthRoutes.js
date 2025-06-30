const express = require("express");
const router = express.Router();
const {
  loginDoctor,
  changePassword,
} = require("../controllers/doctorAuthController");
const auth = require("../middleware/authMiddleware");

router.post("/login", loginDoctor);
router.post("/change-password", auth, changePassword);

module.exports = router;
