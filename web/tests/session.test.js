const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');

describe('Session Controller', () => {
  let user;

  beforeEach(async () => {
    user = await User.create({ username: 'sessionuser' });
  });

  it('should start a new session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/register').send({ username: 'sessionuser' });
    const res = await agent.post('/api/sessions');

    expect(res.statusCode).toEqual(201);
    expect(res.body.sessionId).toBeDefined();
  });

  it('should end a session', async () => {
    const agent = request.agent(app);
    await agent.post('/api/register').send({ username: 'sessionuser' });
    await agent.post('/api/sessions');

    const res = await agent.put(`/api/sessions/${1}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual('Session ended');
  });
});
