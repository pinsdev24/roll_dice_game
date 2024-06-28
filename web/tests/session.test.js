const request = require('supertest');
const app = require('../src/app');
const { User, Session, Configuration } = require('../src/models');
const jwt = require('jsonwebtoken');

describe('Session API', () => {
  let token;
  let userId;

  beforeEach(async () => {
    await User.destroy({ where: {} });
    await Session.destroy({ where: {} });
    await Configuration.destroy({ where: {} });

    const user = await User.create({ username: 'testuser', password: 'password123' });
    userId = user.id;
    token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  });

  test('Should start a new session', async () => {
    const res = await request(app)
      .post('/api/sessions')
      .set('Authorization', `Bearer ${token}`)
      .send({
        playerCount: 2,
        diceCount: 2,
        gameCount: 5,
        waitTime: 10
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'Session started');
    expect(res.body).toHaveProperty('sessionId');

    const session = await Session.findByPk(res.body.sessionId);
    expect(session).toBeTruthy();
    expect(session.creatorId).toBe(userId);

    const config = await Configuration.findOne({ where: { sessionId: res.body.sessionId } });
    expect(config).toBeTruthy();
    expect(config.playerCount).toBe(2);
    expect(config.diceCount).toBe(2);
    expect(config.gameCount).toBe(5);
    expect(config.waitTime).toBe(10);
  });

  test('Should end a session', async () => {
    const session = await Session.create({ startTime: new Date(), creatorId: userId });

    const res = await request(app)
      .put(`/api/sessions/${session.id}`)
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('message', 'Session ended');
    expect(res.body).toHaveProperty('sessionId', session.id);

    const updatedSession = await Session.findByPk(session.id);
    expect(updatedSession.endTime).toBeTruthy();
  });
});