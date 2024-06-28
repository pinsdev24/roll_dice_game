const { Game, Session } = require('../models');

exports.saveGame = async (req, res) => {
  try {
    const sessionId = req.session.sessionId;
    const {id} = req.session.user;
    const {score} = req.body

    const game = await Game.create({
      startTime: new Date(),
      UserId: id,
      SessionId: sessionId,
      score,
    });

    res.status(201).json({ message: 'Game started', gameId: game.id });
  } catch (error) {
    res.status(400).json({ message: 'Error starting game', error: error.message });
  }
};

exports.endGame = async (req, res) => {
  try {
    const { gameId } = req.params;
    const { score } = req.body;

    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    game.endTime = new Date();
    game.score = score;
    await game.save();

    res.json({ message: 'Game ended', gameId: game.id, score });
  } catch (error) {
    res.status(400).json({ message: 'Error ending game', error: error.message });
  }
};