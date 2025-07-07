import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useState } from 'react';
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

const registerSchema = z
  .object({
    name: z.string().min(1, '이름을 입력하세요'),
    phone: z.string().min(10, '전화번호를 입력하세요'),
    email: z.string().email('유효한 이메일을 입력하세요'),
    password: z.string().min(6, '비밀번호는 최소 6자 이상이어야 합니다'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '비밀번호가 일치하지 않습니다',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.title, {
          description: result.description,
        });
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
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl'>만나서 반가워요 👋</CardTitle>
          <CardDescription>
            아래 정보를 입력해 회원가입을 완료해주세요
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
            <div className='grid gap-5'>
              <div className='grid gap-2'>
                <Label htmlFor='name'>이름</Label>
                <Input id='name' placeholder='홍길동' {...register('name')} />
                {errors.name && (
                  <p className='text-sm text-red-500'>{errors.name.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='phone'>전화번호</Label>
                <Input
                  id='phone'
                  placeholder='01012345678'
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className='text-sm text-red-500'>{errors.phone.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='email'>이메일 주소</Label>
                <Input
                  id='email'
                  placeholder='example@teamflow.com'
                  {...register('email')}
                />
                {errors.email && (
                  <p className='text-sm text-red-500'>{errors.email.message}</p>
                )}
              </div>
              <div className='grid gap-2'>
                <Label htmlFor='password'>비밀번호</Label>
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
            </div>
            <Button type='submit' className='w-full' disabled={isLoading}>
              {isLoading && <Loader2 className='h-4 w-4 animate-spin' />}
              회원가입
            </Button>
          </form>
        </CardContent>

        <CardFooter>
          <CardAction className='w-full'>
            <p className='text-center text-sm text-muted-foreground'>
              이미 계정이 있으신가요?
              <Button
                variant='link'
                className='text-blue-600'
                onClick={() => navigate('/login', { replace: true })}
              >
                로그인하러 가기
              </Button>
            </p>
          </CardAction>
        </CardFooter>
      </Card>
    </div>
  );
}
