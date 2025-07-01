import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
  CardAction,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthStore } from '@/stores/useAuthStore';

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // 훅 사용
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    // 로그인 요청 로직
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        useAuthStore.getState().setAccessToken(result.accessToken);
        navigate('/', { replace: true });
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
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-2xl'>Guess Who's Back?</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            id='login-form'
            onSubmit={handleSubmit(onSubmit)}
            className='space-y-4'
          >
            <div className='flex flex-col gap-5'>
              <div className='grid gap-2'>
                <Label htmlFor='email'>Email</Label>
                <Input
                  id='email'
                  placeholder='email@example.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <div className='flex items-center'>
                  <Label htmlFor='password'>Password</Label>
                  <Button
                    variant='link'
                    className='ml-auto text-blue-600'
                    onClick={(e: React.FormEvent) => {
                      e.preventDefault();
                      navigate('/forgot-password', { replace: true });
                    }}
                  >
                    Forgot your password?
                  </Button>
                </div>
                <Input
                  id='password'
                  type='password'
                  {...register('password')}
                />
                {errors.password && (
                  <p className='text-sm text-red-500'>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className='flex-col gap-2'>
          <Button
            type='submit'
            className='w-full'
            form='login-form'
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
            Login
          </Button>

          <CardAction className='w-full'>
            <p className='text-center text-sm text-muted-foreground'>
              Don’t have an account?
              <Button
                variant='link'
                className='text-blue-600'
                onClick={() => navigate('/register', { replace: true })}
              >
                Sign Up
              </Button>
            </p>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
