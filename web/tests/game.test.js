const request = require('supertest');
const app = require('../src/app');
const { User, Session } = require('../src/models');

describe('Game Controller', () => {
  let user, session;

  beforeEach(async () => {
    user = await User.create({ username: 'gameuser' });
    session = await Session.create({
      startTime: new Date(),
      creatorId: user.id,
      UserId: user.id,
    });
  });

  it('should save a new game', async () => {
    const agent = request.agent(app);
    await agent.post('/api/register').send({ username: 'gameuser' });
    agent.jar.setCookies(`sessionId=${session.id}`);

    const res = await agent.post('/api/save-game').send({ score: 100, SessionId: session.id });

    expect(res.statusCode).toEqual(201);
    expect(res.body.gameId).toBeDefined();
  });
});