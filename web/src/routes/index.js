const express = require('express');
const userController = require('../controllers/userController');
const sessionController = require('../controllers/sessionController');
const gameController = require('../controllers/gameController');

const router = express.Router();

// User routes
router.post('/register', userController.createUser);
router.post('/guest', userController.createGuestUser);
router.post('/logout', userController.logout);

// Session routes
router.post('/sessions', sessionController.startSession);
router.put('/sessions/:sessionId', sessionController.endSession);

// Game routes
//router.post('/sessions/:sessionId/games', gameController.startGame);
router.post('/save-game', gameController.saveGame);
router.put('/games/:gameId', gameController.endGame);

module.exports = router;