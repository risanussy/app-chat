const express = require("express");
const { verifyToken } = require("../middleware/VerifyToken");
const { refreshToken } = require("../controllers/refreshToken");

// controllers
const { GetUsers, Register, Login, Logout } = require("../controllers/users");
 
const router = express.Router();
 
router.get('/users', verifyToken, GetUsers);
router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
 
module.exports = router;