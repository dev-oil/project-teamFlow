// src/pages/LoginPage.tsx

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { AuthTutorialCarousel } from '@/components/Auth/AuthTutorialCarousel';
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

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const navigate = useNavigate(); // 훅 사용
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginForm) => {
    // 로그인 요청 로직
    console.log(data);
    navigate('/', { replace: true }); // [dev] 홈으로 이동
  };

  return (
    <div className='flex h-screen'>
      {/* Left: 캐러셀 */}
      <AuthTutorialCarousel />
      {/* Right: 로그인 폼 */}
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
                    placeholder='email@example.com'
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className='text-sm text-red-500 mt-1'>
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div className='grid gap-2'>
                  <div className='flex items-center'>
                    <Label htmlFor='password'>Password</Label>
                    <a
                      href='#'
                      className='ml-auto inline-block text-sm underline-offset-4 hover:underline text-blue-600'
                    >
                      Forgot your password?
                    </a>
                  </div>
                  <Input type='password' {...register('password')} />
                  {errors.password && (
                    <p className='text-sm text-red-500 mt-1'>
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
          <CardFooter className='flex-col gap-2'>
            <Button type='submit' className='w-full' form='login-form'>
              Login
            </Button>
            <Button
              variant='outline'
              className='w-full'
              form='login-form'
              type='button'
              onClick={() => {
                localStorage.setItem('token', 'dev-token'); // ✅ 토큰 저장

                // 추후 실제 로그인 기능 붙일 땐 Context나 zustand 같은 상태 관리로 확장해서 useAuth()를 상태 기반으로 구현
                window.location.href = '/'; // 또는 window.location.reload() 해도 됨
              }}
            >
              [Dev] Enter
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
    </div>
  );
}
