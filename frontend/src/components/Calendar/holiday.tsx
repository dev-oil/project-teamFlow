//Calendar/holiday.tsx
import { useEffect, useState } from 'react';

type HolidayItem = {
  locdate: string;
  dateName: string;
};

export function usePublicHolidays(year: number) {
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!year) return;
    setLoading(true);
    fetch(`/api/holidays?year=${year}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch holidays');
        return res.json();
      })
      .then((data: HolidayItem[]) => {
        setHolidays(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message);
        setLoading(false);
      });
  }, [year]);

  return { holidays, loading, error };
}
