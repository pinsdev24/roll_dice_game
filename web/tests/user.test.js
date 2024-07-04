const request = require('supertest');
const app = require('../src/app');
const { sequelize, User } = require('../src/models');

describe('User Controller', () => {
  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'testuser' });

    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toEqual('testuser');
  });

  it('should not create a user with the same username', async () => {
    await User.create({ username: 'duplicateuser' });
    const res = await request(app)
      .post('/api/register')
      .send({ username: 'duplicateuser' });

    expect(res.statusCode).toEqual(409);
  });

  it('should create a guest user', async () => {
    const res = await request(app).post('/api/guest');

    expect(res.statusCode).toEqual(201);
    expect(res.body.username).toMatch(/Guest_/);
  });
});
