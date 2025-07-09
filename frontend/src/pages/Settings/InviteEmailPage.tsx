import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

import { toast } from 'sonner';

import { Button } from '@/components/ui/button';

import { customFetch } from '@/lib/customFetch';

export function InviteEmailPage() {
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

    // 초대 토큰 유효성 검사
    fetch(`/api/invite/verify?token=${token}`)
      .then((res) => {
        if (!res.ok) throw new Error('Invalid token');
        setStatus('success');
      })
      .catch(async (err) => {
        const msg = (await err?.response?.json?.()) ?? '초대 토큰 검증 실패';
        console.error(msg);
        setStatus('error');
      });
  }, [searchParams]);

  // 초대 수락
  const handleAcceptInvitation = async () => {
    const token = searchParams.get('token');
    if (!token) return;

    const res = await customFetch('/api/invite/accept', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    console.log(data);
    if (res.ok) {
   
      toast.success('초대 수락 완료! 워크스페이스로 이동합니다.');
      //navigate(`/workspaces/${data.workspaceId}`);
      window.location.href = '/';
      //navigate(`/`, { replace: true });
    } else {
      toast.error(data.error || '초대 수락 실패');
    }
  };

  if (status === 'loading') {
    return <p className='text-center mt-10'>🔄 이메일 인증 중입니다...</p>;
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen px-4 text-center'>
      {status === 'success' ? (
        <>
          <h1 className='text-2xl font-bold mb-4'>🎉 초대가 유효합니다!</h1>
          <p className='mb-6 text-muted-foreground'>
            아래 버튼을 눌러 워크스페이스에 참여하세요.
          </p>
          <Button onClick={handleAcceptInvitation}>초대 수락하기</Button>
        </>
      ) : (
        <>
          <h1 className='text-2xl font-bold mb-4'>❌ 인증 실패</h1>
          <p className='mb-6 text-muted-foreground'>
            유효하지 않거나 만료된 링크입니다.
          </p>
          <Button onClick={() => navigate('/', { replace: true })}>
            홈으로
          </Button>
        </>
      )}
    </div>
  );
}
