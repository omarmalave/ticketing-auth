import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import {app} from "../app";

let mongo: MongoMemoryServer;

declare global {
    namespace NodeJS {
        interface Global {
            signup(): Promise<string[]>
        }
    }
}

beforeAll(async () => {
    process.env.JWT_KEY = 'orion';

    mongo = new MongoMemoryServer();
    const mongoUri = await mongo.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
});

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections();

    collections.forEach(collection => {
       collection.deleteMany({});
    });
});

afterAll(async () => {
    await mongo.stop();
    await mongoose.connection.close();
});

global.signup = async () => {
    const email = 'test@test.com';
    const password = 'passwsord';

    const response = await request(app)
        .post('/api/users/signup')
        .send({email, password})
        .expect(201);

    return response.get('Set-Cookie');
}