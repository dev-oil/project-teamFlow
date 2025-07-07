//calendar.controller.ts
import type { Request, Response } from 'express';
import { Holidays } from '../services/calendar.service';

export const getHolidays = async (req: Request, res: Response) => {
  const year = req.query.year?.toString();
  if (!year) return res.status(400).json({ error: 'Year is required' });

  try {
    const holidays = await Holidays(year);
    res.json(holidays);
  } catch (error) {
    console.error('공휴일 조회 실패:', error);
    res.status(500).json({ error: 'Failed to fetch holidays' });
  }
};