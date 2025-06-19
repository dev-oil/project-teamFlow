import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const navigate = useNavigate();

  const isValidEmail = (email: string) => {
    return /^[\\w.-]+@[\\w.-]+\\.\\w{2,}$/.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isValidEmail(email)) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }
    setError('');

    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (error) {
      console.error('전송 실패:', error);
    }
  };

  return (
    <div className='w-1/2 flex items-center justify-center'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Forgot your password?</CardTitle>
          <CardDescription>
            We’ll send you a reset link to your email.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <p className='text-sm text-muted-foreground'>
              If an account exists for{' '}
              <span className='font-medium'>{email}</span>, you’ll receive an
              email with a reset link.
            </p>
          ) : (
            <form onSubmit={handleSubmit} className='grid gap-4'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  type='text'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder='email@example.com'
                  required
                />
                {error && <p className='text-sm text-red-500'>{error}</p>}
              </div>
              <Button type='submit' className='w-full'>
                Send Reset Link
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
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
