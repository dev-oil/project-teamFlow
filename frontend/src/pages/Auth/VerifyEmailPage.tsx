import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';

export function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setStatus('error');
      return;
    }

    fetch(`/api/auth/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        setStatus('success');
      })
      .catch(() => setStatus('error'));
  }, [searchParams]);

  if (status === 'loading') {
    return <p className='text-center mt-10'>이메일 인증 중입니다...</p>;
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      {status === 'success' ? (
        <>
          <h1 className='text-2xl font-bold mb-4'>🎉 이메일 인증 완료</h1>
          <p className='mb-6 text-muted-foreground'>
            로그인 후 서비스를 이용해보세요.
          </p>
          <Button onClick={() => navigate('/login', { replace: true })}>
            로그인 하러가기
          </Button>
        </>
      ) : (
        <>
          <h1 className='text-2xl font-bold mb-4'>❌ 인증 실패</h1>
          <p className='mb-6 text-muted-foreground'>
            유효하지 않은 토큰이거나 만료된 링크입니다.
          </p>
          <Button onClick={() => navigate('/', { replace: true })}>
            홈으로
          </Button>
        </>
      )}
    </div>
  );
}
