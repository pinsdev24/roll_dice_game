const { Session, Configuration, User } = require('../models');

exports.startSession = async (req, res) => {
  try {
    const { id } = req.session.user;

    const session = await Session.create({
      startTime: new Date(),
      creatorId: id,
      UserId: id,
    });

    await Configuration.create({ SessionId: session.id });

    const user = await User.findByPk(id);
    await session.addPlayer(user);

    req.session.sessionId = session.id;
    res.status(201).json({ message: 'Session started', sessionId: session.id });
  } catch (error) {
    res.status(400).json({ message: 'Error starting session', error: error.message });
  }
};

exports.endSession = async (req, res) => {
  try {
    const sessionId = req.session.sessionId;
    if (!sessionId) {
      return res.status(404).json({ message: 'No current Session' });
    }
    const session = await Session.findByPk(sessionId);
    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }
    session.endTime = new Date();
    await session.save();
    req.session.sessionId = null
    res.status(200).json({ message: 'Session ended'});
  } catch (error) {
    res.status(400).json({ message: 'Error ending session', error: error.message });
  }
};