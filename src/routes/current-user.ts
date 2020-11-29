import express from 'express';
import { RequireAuth } from '@om_tickets/common';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
  res.send({ currentUser: req.currentUser || null });
});

export default router;
