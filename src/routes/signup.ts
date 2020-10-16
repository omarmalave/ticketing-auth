import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import jwt from 'jsonwebtoken';
import { ValidateRequest, BadRequestError } from '@om_tickets/common';
import User from '../models/user';

const router = express.Router();

const validations = [
  body('email').isEmail().withMessage('Email must be valid'),
  body('password').trim().isLength({ min: 4, max: 20 })
    .withMessage('Password must be between 4 an 20 characters'),
];

router.post('/api/users/signup', validations, ValidateRequest,
  async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError('Email already in use');
    }

    const user = User.build({ email, password });
    await user.save();

    // Generate jwt
    const userJwt = jwt.sign({
      id: user.id,
      email: user.email,
    }, process.env.JWT_KEY!);

    req.session = {
      jwt: userJwt,
    };

    // store it on session object
    res.status(201).send(user);
  });

export default router;
