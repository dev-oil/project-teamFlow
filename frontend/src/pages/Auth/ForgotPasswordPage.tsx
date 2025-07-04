import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('이메일 주소를 입력해주세요');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        setSubmitted(true);
        toast.success(result.title, {
          description: result.description,
        });
      } else {
        toast.warning(result.title, {
          description: result.description,
        });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.warning(error.name, {
          description: error.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='w-1/2 flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>비밀번호를 잊으셨나요?</CardTitle>
          <CardDescription>
            가입하신 이메일 주소로 비밀번호 재설정 링크를 보내드립니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className='text-sm text-muted-foreground'>
              <span className='font-medium'>{email}</span> 주소로 비밀번호
              재설정 메일을 보냈어요
              <br />곧 메일함에서 확인하실 수 있어요.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>이메일 주소</Label>
                <Input
                  id='email'
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='example@teamflow.com'
                  required
                />
                {error && <p className='text-sm text-red-500'>{error}</p>}
              </div>
              <Button type='submit' className='w-full' disabled={isLoading}>
                {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
                재설정 링크 보내기
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className='justify-center'>
          <Button
            variant='link'
            className='text-blue-600'
            onClick={() => navigate('/login')}
          >
            로그인으로 돌아가기
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
