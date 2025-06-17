import { useEffect } from 'react';

export function DashboardPage() {
  useEffect(() => {
    fetch('/api/tasks')
      .then((res) => res.json())
      .then((data) => console.log(data));
  }, []);

  return <div>DashboardPage</div>;
}
