import { Outlet } from 'react-router-dom';

import { AuthTutorialCarousel } from '@/components/Auth/AuthTutorialCarousel';

export function AuthLayout() {
  return (
    <div className='flex h-screen'>
      {/* Left: 캐러셀 */}
      <AuthTutorialCarousel />
      {/* Right: 로그인 폼 */}
      <Outlet />
    </div>
  );
}
