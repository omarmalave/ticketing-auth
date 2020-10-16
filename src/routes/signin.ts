import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { ValidateRequest, BadRequestError } from '@om_tickets/common';
import User from '../models/user';

import PasswordManager from '../services/password-manager';

const router = express.Router();

const validations = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().notEmpty()
    .withMessage('You must supply a password'),
];

router.post('/api/users/signin', validations, ValidateRequest, async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new BadRequestError('Invalid credentials');
  }

  const passwordsMatch = await PasswordManager.compare(existingUser.password, password);
  if (!passwordsMatch) {
    throw new BadRequestError('Invalid Credentials');
  }

  // Generate jwt
  const userJwt = jwt.sign({
    id: existingUser.id,
    email: existingUser.email,
  }, process.env.JWT_KEY!);

  req.session = {
    jwt: userJwt,
  };

  // store it on session object
  res.status(201).send(existingUser);
});

export default router;
