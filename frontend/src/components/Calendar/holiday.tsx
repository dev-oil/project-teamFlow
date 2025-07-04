//Calendar/holiday.tsx
import { useEffect, useState } from 'react';

const SERVICE_KEY =
  'MJMD6kyAcwn4zDEcbqLnrUmxmTo4vK0BYwnE9DtEA/yqKFmuGzDaRAV7RNTIH4BX1aZ9ujBOdLHeFmEhO/GcIA==';

interface HolidayItem {
  locdate: string; // YYYYMMDD 형태
  dateName: string;
}

export function usePublicHolidays(year: number) {
  const [holidays, setHolidays] = useState<HolidayItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const url =
      `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?` +
      `solYear=${year}&` +
      `numOfRows=100&` + // ← 데이터 개수 늘리기
      `ServiceKey=${encodeURIComponent(SERVICE_KEY)}&` +
      `_type=json`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error('Network response was not ok');
        return res.json();
      })
      .then((data) => {
        // 공공데이터 포맷에 맞게 파싱 (data.response.body.items.item)
        const items = data.response?.body?.items?.item ?? [];
        setHolidays(items);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [year]);

  return { holidays, loading, error };
}
