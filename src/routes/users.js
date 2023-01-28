const express = require("express");
const { refreshToken } = require("../controllers/refreshToken");

// controllers
const { Register, Login, Logout } = require("../controllers/users");
 
const router = express.Router();

router.post('/register', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);
 
module.exports = router;