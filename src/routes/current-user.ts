import express from 'express';
import { CurrentUser } from '@om_tickets/common';

const router = express.Router();

router.get('/api/users/currentuser', CurrentUser, (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export default router;
