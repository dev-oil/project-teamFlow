import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
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
  const [showPassword, setShowPassword] = useState(false);
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
          <CardTitle className='text-2xl'>만나서 반가워요 👋</CardTitle>
          <CardDescription>
            로그인하려면 이메일과 비밀번호를 입력해주세요
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
                <Label htmlFor='email'>이메일 주소</Label>
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
                  <Label htmlFor='password'>비밀번호</Label>
                  <Button
                    variant='link'
                    className='ml-auto text-blue-600'
                    onClick={(e: React.FormEvent) => {
                      e.preventDefault();
                      navigate('/forgot-password', { replace: true });
                    }}
                  >
                    비밀번호를 잊으셨나요?
                  </Button>
                </div>
                <div className='relative'>
                  <Input
                    id='password'
                    type={showPassword ? 'text' : 'password'}
                    {...register('password')}
                    className='pr-10'
                  />
                  <button
                    type='button'
                    onClick={() => setShowPassword((prev) => !prev)}
                    className='absolute inset-y-0 right-0 px-3 flex items-center text-muted-foreground'
                    tabIndex={-1}
                    aria-label='비밀번호 보기 토글'
                  >
                    {showPassword ? (
                      <EyeOff className='w-4 h-4' />
                    ) : (
                      <Eye className='w-4 h-4' />
                    )}
                  </button>
                </div>
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
            로그인
          </Button>

          <CardAction className='w-full'>
            <p className='text-center text-sm text-muted-foreground'>
              아직 계정이 없으신가요?
              <Button
                variant='link'
                className='text-blue-600'
                onClick={() => navigate('/register', { replace: true })}
              >
                회원가입하러 가기
              </Button>
            </p>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
