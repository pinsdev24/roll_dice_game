const request = require('supertest');
const app = require('../src/app');
const { User, Session, Game } = require('../src/models');
const jwt = require('jsonwebtoken');

describe('Game API', () => {
  let token;
  let userId;
  let sessionId;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await Game.destroy({ where: {} });

    const user = await User.create({ username: 'testuser', password: 'password123' });
    userId = user.id;
    token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

    const session = await Session.create({ startTime: new Date(), creatorId: userId });
    sessionId = session.id;
  });

  test('Should start a new game', async () => {
    const res = await request(app)
      .post(`/api/sessions/${sessionId}/games`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Game started');
    expect(res.body).toHaveProperty('gameId');

    const game = await Game.findByPk(res.body.gameId);
    expect(game).toBeTruthy();
    expect(game.userId).toBe(userId);
    expect(game.sessionId).toBe(sessionId);
  });

  test('Should end a game', async () => {
    const game = await Game.create({ startTime: new Date(), sessionId, userId });

    const res = await request(app)
      .put(`/api/games/${game.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ score: 100 });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Game ended');
    expect(res.body).toHaveProperty('gameId', game.id);
    expect(res.body).toHaveProperty('score', 100);

    const updatedGame = await Game.findByPk(game.id);
    expect(updatedGame.endTime).toBeTruthy();
    expect(updatedGame.score).toBe(100);
  });
});