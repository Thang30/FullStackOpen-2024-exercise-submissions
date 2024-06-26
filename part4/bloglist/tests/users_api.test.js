const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const User = require('../models/user');
const { test, describe, before, afterEach } = require('node:test');
const assert = require('node:assert');
const bcrypt = require('bcrypt');

describe('User API', () => {
  before(async () => {
    await mongoose.connect(config.MONGODB_URI);
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'freshuser',
      name: 'Fresh User',
      password: 'freshpassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await User.find({});

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'superuser',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert(result.body.error.includes('Username must be unique'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with proper statuscode and message if username is too short', async () => {
    const newUser = {
      username: 'ja',
      name: 'Ja',
      password: 'jajaja',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Username and password must be at least 3 characters long'));
  });

  test('creation fails with proper statuscode and message if password is too short', async () => {
    const newUser = {
      username: 'shortpassword',
      name: 'Short Password',
      password: 'sh',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Username and password must be at least 3 characters long'));
  });
    
  after(async () => {
    await mongoose.connection.close();
  });
});
