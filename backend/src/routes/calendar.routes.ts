//calendar.routes.ts
import express from 'express';
import { getHolidays } from '../controllers/calendar.controller';

const router = express.Router();

// 배포 시 활성화
router.get('/', getHolidays);

export default router;
