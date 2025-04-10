const express = require('express');
const { register, login, getMe, logout } = require('../controllers/auth');
const router = express.Router();

const passport = require('passport');
const {protect}=require('../middleware/auth');

router.post('/register', register);
router.post('/login',login);
router.get('/me',protect,getMe);
router.get('/logout',logout);

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/' }),
  (req, res) => {
    const token = req.user.getSignedJwtToken();
    res.redirect(`/dashboard?token=${token}`); // ส่ง token ไป frontend
  }
);

module.exports = router;