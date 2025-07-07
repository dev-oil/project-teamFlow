const SERVICE_KEY = process.env.HOLIDAY_API_KEY!;

export const Holidays = async (year: string) => {
  const url =
    `https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo` +
    `?solYear=${year}&numOfRows=100&_type=json&ServiceKey=${encodeURIComponent(
      SERVICE_KEY
    )}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch holiday data');
  }

  const data = await response.json();
  return data.response?.body?.items?.item ?? [];
};