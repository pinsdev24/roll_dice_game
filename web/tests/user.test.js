const request = require('supertest');
const app = require('../src/app');
const { User } = require('../src/models');
const bcrypt = require('bcrypt');

describe('User API', () => {
  beforeEach(async () => {
    await User.destroy({ where: {} });
  });

  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/register')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User created successfully');
    expect(res.body).toHaveProperty('userId');
  });

  test('Should login a user', async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await User.create({ username: 'testuser', password: hashedPassword });

    const res = await request(app)
      .post('/api/login')
      .send({
        username: 'testuser',
        password: 'password123'
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  test('Should create a guest user', async () => {
    const res = await request(app)
      .post('/api/guest');
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('username');
    expect(res.body.username).toMatch(/^Guest_/);
  });
});