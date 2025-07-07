//calendar.routes.ts
import express from 'express';
import { getHolidays } from '../controllers/calendar.controller';

const router = express.Router();

router.get('/', getHolidays);

export default router;

// const router = express.Router();

// const SERVICE_KEY = process.env.HOLIDAY_API_KEY!;

// router.get('/', async (req, res) => {
//   const year = req.query.year?.toString();
//   if (!year) return res.status(400).json({ error: 'Year is required' });

//   const url =
//     `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo` +
//     `?solYear=${year}&numOfRows=100&_type=json&ServiceKey=${encodeURIComponent(
//       SERVICE_KEY
//     )}`;

//   try {
//     const response = await fetch(url);
//     if (!response.ok) throw new Error('Failed to fetch');

//     const data = await response.json();
//     const holidays = data.response?.body?.items?.item ?? [];

//     res.json(holidays);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to fetch holidays' });
//   }
// });
