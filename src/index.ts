import mongoose from 'mongoose';
import pino from 'pino';
import app from './app';

const log = pino();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    log.info('Connected to MongoDB');
  } catch (err) {
    log.error(err);
  }

  app.listen(3000, () => {
    log.info('Listening on port: 3000');
  });
};

start();
