import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const resetSchema = z
  .object({
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type ResetForm = z.infer<typeof resetSchema>;

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetForm>({
    resolver: zodResolver(resetSchema),
  });

  const [invalidToken, setInvalidToken] = useState(false);
  const [done, setDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token) setInvalidToken(true);
  }, [token]);

  const onSubmit = async (data: ResetForm) => {
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: data.password }),
      });
      if (response.ok) {
        setDone(true);
      } else {
        const result = await response.json();
        toast.warning(result.title, {
          description: result.description,
        });
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.warning(err.name, {
          description: err.message,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (invalidToken) {
    return (
      <p className='text-center mt-10 text-red-500'>
        유효하지 않은 링크입니다. 다시 시도해주세요.
      </p>
    );
  }

  if (done) {
    return (
      <div className='flex flex-col items-center justify-center h-screen'>
        <h2 className='text-2xl font-bold mb-4'>
          비밀번호가 성공적으로 변경되었어요
        </h2>
        <Button onClick={() => navigate('/login')}>로그인하러 가기</Button>
      </div>
    );
  }

  return (
    <div className='flex justify-center items-center h-screen'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>비밀번호 재설정</CardTitle>
          <CardDescription>새로운 비밀번호를 입력해주세요</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='grid gap-4'>
            <div className='grid gap-2'>
              <Label htmlFor='password'>새 비밀번호</Label>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className='pr-10'
                  placeholder='비밀번호는 최소 6자 이상'
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
            <div className='grid gap-2'>
              <Label htmlFor='confirmPassword'>비밀번호 확인</Label>
              <div className='relative'>
                <Input
                  id='confirmPassword'
                  type={showPassword ? 'text' : 'password'}
                  {...register('confirmPassword')}
                  className='pr-10'
                  placeholder='비밀번호 다시 입력'
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
              {errors.confirmPassword && (
                <p className='text-sm text-red-500'>
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
              비밀번호 변경
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
