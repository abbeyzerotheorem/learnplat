const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile } = require('../controllers/auth.controller');
const { auth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');
const { registerValidator, loginValidator, updateProfileValidator } = require('../validators/auth.validator');

router.post('/register', registerValidator, validateRequest, register);
router.post('/login', loginValidator, validateRequest, login);
router.get('/profile', auth, getProfile);
router.put('/profile', auth, updateProfileValidator, validateRequest, updateProfile);

module.exports = router;