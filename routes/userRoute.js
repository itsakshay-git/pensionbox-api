const express = require("express");
const router = express.Router();
const { 
    registerUser, 
    loginUser, 
    logout, 
    getUser, 
    loginStatus, 
    changePassword, 
    forgotPassword,
    resetPassword,
    getPaginaredUser
} = require("../controllers/userController");
const protect = require("../middleware/authMiddleware");

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/logout", logout)
router.get("/getuser", getUser)
router.get("/paginatedusers", getPaginaredUser)
router.get("/loggedin", loginStatus)
router.patch("/changepassword", protect, changePassword)
router.post("/forgotpassword", forgotPassword)
router.put("/resetpassword/:resetToken", resetPassword)



module.exports = router