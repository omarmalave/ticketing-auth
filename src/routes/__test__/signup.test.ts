import request from 'supertest';
import app from '../../app';

it('return a 201 on successful signup', async () => request(app).post('/api/users/signup').send({
  email: 'test@test.com',
  password: 'password',
}).expect(201));

it('returns a 400 hundred with an invalid email', async () => request(app).post('/api/users/signup').send({
  email: 'thisisabademail',
  password: 'password',
}).expect(400));

it('returns a 400 hundred with an invalid password', async () => request(app).post('/api/users/signup').send({
  email: 'test@test.com',
  password: 'p',
}).expect(400));

it('returns a 400 hundred with missing email and password', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
  }).expect(400);

  return request(app).post('/api/users/signup').send({
    password: 'thisisavalidpassword',
  }).expect(400);
});

it('disallows duplicate emails', async () => {
  await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'password',
  }).expect(201);

  return request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'password',
  }).expect(400);
});

it('sets a cookie after successful response', async () => {
  const response = await request(app).post('/api/users/signup').send({
    email: 'test@test.com',
    password: 'password',
  }).expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
