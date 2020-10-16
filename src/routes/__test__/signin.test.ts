import request from 'supertest';
import app from '../../app';
// TODO: create tests for email and password validations

it('return a 201 on successful signin', async () => {
  await request(app).post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' }).expect(201);

  return request(app).post('/api/users/signin').send({
    email: 'test@test.com',
    password: 'password',
  }).expect(201);
});

it('returns a 400 hundred with an invalid email', async () => request(app).post('/api/users/signin').send({
  email: 'thisisabademail',
  password: 'password',
}).expect(400));

it('returns a 400 hundred with an invalid password', async () => request(app).post('/api/users/signin').send({
  email: 'test@test.com',
  password: 'p',
}).expect(400));

it('returns a 400 hundred with missing email and password', async () => {
  await request(app).post('/api/users/signin').send({
    email: 'test@test.com',
  }).expect(400);

  return request(app).post('/api/users/signin').send({
    password: 'thisisavalidpassword',
  }).expect(400);
});

it('fails when an email that does not exist is supplied', async () => {
  await request(app).post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' }).expect(400);
});

it('fails when an incorrect password is supplied is supplied', async () => {
  await request(app).post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' }).expect(201);

  await request(app).post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'badpassword' }).expect(400);
});

it('respond with a cookie when given valid credentials', async () => {
  await request(app).post('/api/users/signup')
    .send({ email: 'test@test.com', password: 'password' }).expect(201);

  const response = await request(app).post('/api/users/signin')
    .send({ email: 'test@test.com', password: 'password' }).expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
});
