import express from 'express';
import type { Router } from 'express';
import { proxy } from './api';

export default (): Router => {
  const router = express.Router();

  router.use('/api', proxy());

  return router;
};
